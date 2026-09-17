/**
 * Tool definitions for pi-agent-edu.
 *
 * These tools replicate the API surface of the pi coding-agent built-in tools
 * (read, bash, edit, write, grep, find, ls) for use in the school-formula project.
 *
 * SDK tool signature pattern (from packages/coding-agent/src/core/tools/index.ts):
 *   createReadToolDefinition(cwd, options?)  → ToolDefinition
 *   createBashToolDefinition(cwd, options?)  → ToolDefinition
 *   createEditToolDefinition(cwd, options?)  → ToolDefinition
 *   createWriteToolDefinition(cwd, options?) → ToolDefinition
 *   createGrepToolDefinition(cwd, options?)  → ToolDefinition
 *   createFindToolDefinition(cwd, options?)  → ToolDefinition
 *   createLsToolDefinition(cwd, options?)    → ToolDefinition
 *
 * Each ToolDefinition has:
 *   name: string
 *   label: string
 *   description: string
 *   promptSnippet: string
 *   promptGuidelines: string[]
 *   parameters: TSchema (from typebox)
 *   execute(toolCallId, args, signal?, onUpdate?, ctx?): Promise<{ content, details? }>
 *   renderCall?(args, theme, context): Text
 *   renderResult?(result, options, theme, context): Text
 */

import { readFile, writeFile, access, readdir, stat, chmod } from "node:fs/promises";
import { exec, spawn } from "node:child_process";
import { join, resolve, relative, isAbsolute } from "node:path";
import { constants } from "node:fs";
import { promisify } from "node:util";
import { Type, type Static } from "typebox";

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------

/** Text content returned by a tool */
export interface TextContent { type: "text"; text: string }

/** Result returned by every tool execute() call */
export interface ToolResult {
	content: TextContent[];
	details?: Record<string, unknown>;
}

/** A pi ToolDefinition — see packages/coding-agent/src/core/extensions/types.ts */
export interface ToolDefinition<Schema = unknown, Details = unknown> {
	name: string;
	label: string;
	description: string;
	promptSnippet: string;
	promptGuidelines: string[];
	parameters: unknown; // TSchema from typebox
	execute(
		toolCallId: string,
		args: Record<string, unknown>,
		signal?: AbortSignal,
		onUpdate?: (update: unknown) => void,
		ctx?: unknown,
	): Promise<{ content: TextContent[]; details?: Details }>;
}

// ---------------------------------------------------------------------------
// Tool schemas (matches the pi coding-agent source exactly)
// ---------------------------------------------------------------------------

const readSchema = Type.Object({
	path: Type.String({ description: "Path to the file to read (relative or absolute)" }),
	offset: Type.Optional(Type.Number({ description: "Line number to start reading from (1-indexed)" })),
	limit: Type.Optional(Type.Number({ description: "Maximum number of lines to read" })),
});

const bashSchema = Type.Object({
	command: Type.String({ description: "Shell command to execute" }),
	cwd: Type.Optional(Type.String({ description: "Working directory for the command" })),
	timeout: Type.Optional(Type.Number({ description: "Timeout in milliseconds" })),
});

const editSchema = Type.Object({
	path: Type.String({ description: "File path to edit" }),
	find: Type.String({ description: "Text to find (exact match, or regex when escaped)" }),
	replace: Type.String({ description: "Replacement text" }),
	occurrence: Type.Optional(Type.Number({ description: "Which match to replace (1 = first, default all)" })),
});

const writeSchema = Type.Object({
	path: Type.String({ description: "File path to write" }),
	content: Type.String({ description: "Content to write" }),
	encoding: Type.Optional(Type.String({ description: "File encoding (default: utf-8)" })),
});

const grepSchema = Type.Object({
	pattern: Type.String({ description: "Search pattern (regex or literal string)" }),
	path: Type.Optional(Type.String({ description: "Directory or file to search (default: current directory)" })),
	glob: Type.Optional(Type.String({ description: "Filter files by glob pattern, e.g. '*.ts'" })),
	ignoreCase: Type.Optional(Type.Boolean({ description: "Case-insensitive search (default: false)" })),
	literal: Type.Optional(Type.Boolean({ description: "Treat pattern as literal string instead of regex (default: false)" })),
});

const findSchema = Type.Object({
	pattern: Type.String({ description: "Glob pattern to match file/directory names" }),
	path: Type.Optional(Type.String({ description: "Directory to search in (default: cwd)" })),
	limit: Type.Optional(Type.Number({ description: "Maximum number of results" })),
});

const lsSchema = Type.Object({
	path: Type.Optional(Type.String({ description: "Directory to list (default: cwd)" })),
});

// ---------------------------------------------------------------------------
// Tool type exports
// ---------------------------------------------------------------------------

export type ReadToolInput = Static<typeof readSchema>;
export type BashToolInput = Static<typeof bashSchema>;
export type EditToolInput = Static<typeof editSchema>;
export type WriteToolInput = Static<typeof writeSchema>;
export type GrepToolInput = Static<typeof grepSchema>;
export type FindToolInput = Static<typeof findSchema>;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function resolvePath(filePath: string, cwd: string): string {
	if (isAbsolute(filePath)) return filePath;
	return resolve(cwd, filePath);
}

async function fileExists(path: string): Promise<boolean> {
	try {
		await access(path, constants.R_OK);
		return true;
	} catch {
		return false;
	}
}

// ---------------------------------------------------------------------------
// Tool implementations
// ---------------------------------------------------------------------------

function createReadToolDefinition(cwd: string): ToolDefinition {
	return {
		name: "read",
		label: "read",
		description:
			"Read the contents of a file. Supports text files. Output is truncated to 2000 lines or 512KB (whichever is hit first). Use offset/limit for large files.",
		promptSnippet: "Read file contents",
		promptGuidelines: ["Use read to examine files instead of cat or sed."],
		parameters: readSchema,
		async execute(_toolCallId, args: Record<string, unknown>): Promise<ToolResult> {
			const { path, offset, limit } = args as { path: string; offset?: number; limit?: number };
			const absolutePath = resolvePath(path, cwd);

			try {
				await access(absolutePath, constants.R_OK);
			} catch {
				return { content: [{ type: "text", text: `Error: file not found or not readable: ${path}` }] };
			}

			let content: string;
			try {
				const buffer = await readFile(absolutePath);
				content = buffer.toString("utf-8");
			} catch (e: unknown) {
				return { content: [{ type: "text", text: `Error reading file: ${String(e)}` }] };
			}

			let lines = content.split("\n");
			const totalLines = lines.length;

			// offset is 1-indexed in the API
			if (offset !== undefined) {
				const startLine = Math.max(0, offset - 1);
				if (startLine >= lines.length) {
					return { content: [{ type: "text", text: `Offset ${offset} is beyond end of file (${lines.length} lines)` }] };
				}
				lines = lines.slice(startLine);
			}

			if (limit !== undefined) {
				lines = lines.slice(0, limit);
			}

			const outputLines = lines.join("\n");
			// Truncate at 512KB
			const MAX_BYTES = 512 * 1024;
			let output = outputLines;
			let truncated = false;
			if (Buffer.byteLength(output, "utf-8") > MAX_BYTES) {
				output = output.slice(0, MAX_BYTES);
				truncated = true;
			}

			let message = output;
			if (truncated) {
				message += `\n\n[Output truncated (512KB limit)]`;
			} else if (offset !== undefined || limit !== undefined) {
				message += `\n\n[Showing ${lines.length} of ${totalLines} lines]`;
			}

			return { content: [{ type: "text", text: message }] };
		},
	};
}

function createBashToolDefinition(cwd: string): ToolDefinition {
	return {
		name: "bash",
		label: "bash",
		description: "Execute a shell command and return its stdout/stderr output.",
		promptSnippet: "Execute shell command",
		promptGuidelines: ["Prefer targeted commands over general ones.", "Check file state after write operations."],
		parameters: bashSchema,
		async execute(_toolCallId, args: Record<string, unknown>, signal?: AbortSignal): Promise<ToolResult> {
			const { command, cwd: cmdCwd, timeout } = args as { command: string; cwd?: string; timeout?: number };
			const workingDir = cmdCwd ? resolvePath(cmdCwd, cwd) : cwd;

			return new Promise((resolve) => {
				const child = exec(
					command,
					{ cwd: workingDir, timeout: timeout ?? 120_000, signal },
					(error, stdout, stderr) => {
						const output = stdout + (stderr ? `\n${stderr}` : "");
						if (error && !output) {
							resolve({ content: [{ type: "text", text: `Command failed: ${error.message}` }] });
						} else {
							resolve({ content: [{ type: "text", text: output || "(no output)" }] });
						}
					},
				);
				child.on("error", (e) => {
					resolve({ content: [{ type: "text", text: `Execution error: ${e.message}` }] });
				});
			});
		},
	};
}

function createEditToolDefinition(cwd: string): ToolDefinition {
	return {
		name: "edit",
		label: "edit",
		description: "Edit text in a file by replacing occurrences of 'find' with 'replace'.",
		promptSnippet: "Edit file contents",
		promptGuidelines: ["Use edit for targeted text replacements.", "Use write to replace an entire file."],
		parameters: editSchema,
		async execute(_toolCallId, args: Record<string, unknown>): Promise<ToolResult> {
			const { path, find, replace, occurrence } = args as {
				path: string; find: string; replace: string; occurrence?: number;
			};
			const absolutePath = resolvePath(path, cwd);

			try {
				await access(absolutePath, constants.R_OK | constants.W_OK);
			} catch {
				return { content: [{ type: "text", text: `Error: file not found or not writable: ${path}` }] };
			}

			let fileContent: string;
			try {
				fileContent = (await readFile(absolutePath, "utf-8")).toString();
			} catch (e: unknown) {
				return { content: [{ type: "text", text: `Error reading file: ${String(e)}` }] };
			}

			let newContent: string = fileContent;
			if (occurrence !== undefined && occurrence > 0) {
				// Replace only the Nth occurrence
				let idx = 0;
				let pos = 0;
				while (idx < occurrence && pos !== -1) {
					pos = fileContent.indexOf(find, pos);
					if (pos !== -1) {
						idx++;
						if (idx === occurrence) {
							newContent = fileContent.slice(0, pos) + replace + fileContent.slice(pos + find.length);
							break;
						}
						pos += find.length;
					} else {
						return { content: [{ type: "text", text: `Only found ${idx} occurrence(s) of "${find}" in file` }] };
					}
				}
				if (idx < occurrence) {
					return { content: [{ type: "text", text: `Only found ${idx} occurrence(s) of "${find}" in file` }] };
				}
			} else if (occurrence === undefined) {
				// Replace all occurrences (only when occurrence is not specified)
				newContent = fileContent.split(find).join(replace);
			}

			if (newContent === fileContent) {
				return { content: [{ type: "text", text: `No changes made: "${find}" not found in file` }] };
			}

			try {
				await writeFile(absolutePath, newContent, "utf-8");
			} catch (e: unknown) {
				return { content: [{ type: "text", text: `Error writing file: ${String(e)}` }] };
			}

			const changedCount = occurrence !== undefined ? 1 : (fileContent.match(new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length;
			return { content: [{ type: "text", text: `Edited ${path}: replaced ${changedCount} occurrence(s)` }] };
		},
	};
}

function createWriteToolDefinition(cwd: string): ToolDefinition {
	return {
		name: "write",
		label: "write",
		description: "Write content to a file, replacing the entire file if it exists.",
		promptSnippet: "Write file contents",
		promptGuidelines: ["Use write to create new files or replace entire file contents."],
		parameters: writeSchema,
		async execute(_toolCallId, args: Record<string, unknown>): Promise<ToolResult> {
			const { path, content, encoding } = args as { path: string; content: string; encoding?: string };
			const absolutePath = resolvePath(path, cwd);

			try {
				await writeFile(absolutePath, content, (encoding ?? "utf-8") as BufferEncoding);
			} catch (e: unknown) {
				return { content: [{ type: "text", text: `Error writing file: ${String(e)}` }] };
			}

			return { content: [{ type: "text", text: `Wrote ${path} (${Buffer.byteLength(content, "utf-8")} bytes)` }] };
		},
	};
}

function createGrepToolDefinition(cwd: string): ToolDefinition {
	return {
		name: "grep",
		label: "grep",
		description: "Search for a pattern in files, returning matching lines with context.",
		promptSnippet: "Search in files",
		promptGuidelines: ["Use grep to find code or text across the project."],
		parameters: grepSchema,
		async execute(_toolCallId, args: Record<string, unknown>): Promise<ToolResult> {
			const { pattern, path: searchPath, glob, ignoreCase, literal } = args as {
				pattern: string; path?: string; glob?: string; ignoreCase?: boolean; literal?: boolean;
			};
			const searchDir = searchPath ? resolvePath(searchPath, cwd) : cwd;

			const grepArgs = [
				...(ignoreCase ? ["-i"] : []),
				...(literal ? ["-F"] : ["-n"]),
				"--",
				pattern,
				searchPath ?? ".",
			];

			const execCmd = `grep ${grepArgs.join(" ")}`;

			return new Promise((resolve) => {
				exec(execCmd, { cwd, timeout: 30_000 }, (error, stdout, stderr) => {
					if (error && !stdout) {
						resolve({ content: [{ type: "text", text: `No matches found for "${pattern}"` }] });
					} else {
						const output = stdout + (stderr ? `\n${stderr}` : "");
						const lines = output.split("\n").filter(Boolean);
						const limited = lines.slice(0, 100);
						let message = limited.join("\n");
						if (lines.length > 100) message += `\n... and ${lines.length - 100} more lines`;
						resolve({ content: [{ type: "text", text: message || "(no matches)" }] });
					}
				});
			});
		},
	};
}

function createFindToolDefinition(cwd: string): ToolDefinition {
	return {
		name: "find",
		label: "find",
		description: "Find files and directories matching a glob pattern.",
		promptSnippet: "Find files",
		promptGuidelines: ["Use find to locate files when you know the pattern but not the exact path."],
		parameters: findSchema,
		async execute(_toolCallId, args: Record<string, unknown>): Promise<ToolResult> {
			const { pattern, path: searchPath, limit } = args as { pattern: string; path?: string; limit?: number };
			const searchDir = searchPath ? resolvePath(searchPath, cwd) : cwd;

			// Use bash find command
			const cmd = `find "${searchDir}" -name "${pattern}" -not -path "*/node_modules/*" -not -path "*/.git/*" 2>/dev/null | head -${limit ?? 100}`;

			return new Promise((resolve) => {
				exec(cmd, { timeout: 30_000 }, (error, stdout) => {
					const matches = stdout.trim().split("\n").filter(Boolean);
					if (matches.length === 0) {
						resolve({ content: [{ type: "text", text: `No files matching "${pattern}" found` }] });
					} else {
						const relMatches = matches.map((m) => relative(cwd, m));
						resolve({ content: [{ type: "text", text: relMatches.join("\n") }] });
					}
				});
			});
		},
	};
}

function createLsToolDefinition(cwd: string): ToolDefinition {
	return {
		name: "ls",
		label: "ls",
		description: "List files and directories in a path.",
		promptSnippet: "List directory contents",
		promptGuidelines: ["Use ls to explore directory structure."],
		parameters: lsSchema,
		async execute(_toolCallId, args: Record<string, unknown>): Promise<ToolResult> {
			const { path: lsPath } = args as { path?: string };
			const targetPath = lsPath ? resolvePath(lsPath, cwd) : cwd;

			try {
				const entries = await readdir(targetPath);
				const lines: string[] = [];
				for (const entry of entries.sort()) {
					try {
						const full = join(targetPath, entry);
						const s = await stat(full);
						lines.push(`${s.isDirectory() ? "d" : "-"}  ${entry}`);
					} catch {
						lines.push(`?  ${entry}`);
					}
				}
				return { content: [{ type: "text", text: lines.join("\n") }] };
			} catch (e: unknown) {
				return { content: [{ type: "text", text: `Error listing directory: ${String(e)}` }] };
			}
		},
	};
}

// ---------------------------------------------------------------------------
// Public factory
// ---------------------------------------------------------------------------

export interface ToolInfo {
	name: string;
	definition: ToolDefinition;
}

const DEFAULT_PROJECT_ROOT = "/Users/shichaopeng/Work/self-dir/projects/school-formula";

/**
 * Create all 7 tool definitions (read, bash, edit, write, grep, find, ls).
 * Each tool operates relative to `cwd` (default: school-formula project root).
 */
export function createTools(cwd: string = DEFAULT_PROJECT_ROOT): ToolInfo[] {
	return [
		{ name: "read",  definition: createReadToolDefinition(cwd) },
		{ name: "bash",  definition: createBashToolDefinition(cwd) },
		{ name: "edit",  definition: createEditToolDefinition(cwd) },
		{ name: "write", definition: createWriteToolDefinition(cwd) },
		{ name: "grep",  definition: createGrepToolDefinition(cwd) },
		{ name: "find",  definition: createFindToolDefinition(cwd) },
		{ name: "ls",    definition: createLsToolDefinition(cwd) },
	];
}
