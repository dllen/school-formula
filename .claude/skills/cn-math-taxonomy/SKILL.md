---
name: cn-math-taxonomy
description: Use when working with the Chinese K-12 knowledge graph (cn-math-taxonomy) in the school-formula project — aligning math/Chinese/English/physics topics, generating tutorials/questions, or diagnosing prerequisite gaps.
---

# Chinese K-12 Knowledge Graph (cn-math-taxonomy)

## Overview

`cn-math-taxonomy` is a connected knowledge graph of Chinese primary/elementary through high school topics, aligned with Ministry of Education curriculum standards. It covers mathematics, Chinese language, English, and physics, with prerequisite edges, diagnostic questions, and curriculum-standard links.

This skill is vendored locally under `.claude/skills/cn-math-taxonomy/repo/` (a git submodule). Use it to align school-formula content with the Chinese national curriculum and to build prerequisite-aware learning paths.

## When to use

- Generating or ordering knowledge points by prerequisite (especially math topics)
- Diagnosing gaps: a failed topic can trace prerequisite chains back to earlier grades
- Creating tutorials, questions, or mastery paths for Chinese-curriculum subjects
- Aligning school-formula content with MOE standards

Not for: prose translation, general content writing unrelated to the curriculum, or replacing verified pedagogical review.

## Data files

| File | Shape | Contents |
|------|-------|----------|
| `data/topics.json` | `Topic[]` | 2,222 nodes. Each: `id`, `name`, `domain`, `grade`, `semester`, `chapter`, `type`, `description`, `mastery_criteria`, `diagnostic_question`, `external`, `standards`, `root_reason` |
| `data/dependencies.json` | `Edge[]` | 3,453 prerequisite edges. Each: `topicId`, `prerequisiteId`, `strength` (`hard`/`soft`), `reason` |
| `data/questions.json` | `Question[]` | 9,035 diagnostic/practice questions. Each: `id`, `topicId`, `difficulty`, `type`, `prompt`, `answer`, `explanation`, `verify` |
| `data/cn-curriculum-standards.json` | `{ standards: [...] }` | MOE curriculum-standard entries referenced from topics |

## Usage patterns

```ts
import topics from './data/topics.json';
import deps from './data/dependencies.json';

const byId = new Map(topics.map((t) => [t.id, t]));

// topic → prerequisites (must master first)
const prereqs = deps
  .filter((d) => d.topicId === id)
  .map((d) => ({ ...byId.get(d.prerequisiteId), strength: d.strength, reason: d.reason }));

// topic → unlocks (reverse edges)
const unlocks = deps
  .filter((d) => d.prerequisiteId === id)
  .map((d) => byId.get(d.topicId));
```

```ts
import questions from './data/questions.json';
const forTopic = questions.filter((q) => q.topicId === id);
```

## Mapping to school-formula

- `KnowledgePoint.title` ← `name`
- `KnowledgePoint.description` ← `description`
- `KnowledgePoint.studyTips`/`tags` ← `mastery_criteria`, `root_reason`, `standards`
- `KnowledgePoint.practiceQuestions` ← `questions.json` filtered by `topicId`
- Keep the taxonomy `id` (e.g. `cnm_p001`) as a cross-reference; it is not necessarily route-safe, so do not use it directly as `KnowledgePoint.id`.

## License & attribution

This is a downstream vendored dataset. Respect the upstream license. The upstream repository states it is AI-generated draft material and requires pedagogical review before use in teaching or diagnosis.

> Source: https://github.com/xiaoyang111222/cn-math-taxonomy

## Common mistakes

- Treating AI-generated questions/answers as verified — the upstream repo explicitly notes the content is an unaudited draft.
- Ignoring `strength: 'soft'` edges — these indicate helpful but non-blocking prerequisites.
- Assuming English/physics graphs connect to the math graph; they are separate graphs.
