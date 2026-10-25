import{K as E,j as e,r as d,d as W,u as U,L as _,F as X}from"./index-Bt_KHa-c.js";import{A}from"./AdUnit-CrUrZ_Hm.js";import{a as T,c as L,r as R,b as I,f as M,M as v,d as H}from"./errors-CpUyS1Ig.js";const J=(t,r)=>`
你是一位专业的家庭教育顾问和学科专家。请为家长撰写一份关于"${t}"的深度辅导指南。
背景信息：${r}

请严格按以下markdown格式输出（不要输出其他无关内容）：

# 💡 深度解析
（用通俗易懂的语言，配合生活案例，深入浅出地讲解该知识点的核心逻辑，适合家长讲给孩子听）

# 🌍 生活应用场景
（列举3-5个日常生活中的具体应用场景，让知识变得有用、有趣）

# 👨‍👩‍👧 亲子互动案例
（设计一个具体的对话或互动游戏脚本，帮助家长指导孩子）

# ✏️ 实战小测验
（3道精选练习题，附带答案和解析）
1. [题目]
   * 答案：
   * 解析：
`,Y=async(t,r,n)=>{const a=T();if(!a)throw new Error("AI 配置未找到");const l=J(t,r);if(a.provider==="gateway"){await L({prompt:l},n);return}if(R(a)&&!a.apiKey)throw new Error("API Key not configured");const s=I(a);try{const i=await s.chat.completions.create({model:a.model,messages:[{role:"user",content:l}],stream:!0});for await(const p of i){const u=p.choices[0]?.delta?.content||"";u&&n(u)}}catch(i){throw console.error("AI Generation Error:",i),M(i,a)}},Z=(t,r)=>{let n=t.template;for(const[a,l]of Object.entries(r))n=n.replace(new RegExp(`\\{\\{${a}\\}\\}`,"g"),l);return n=n.replace(/\{\{#if (\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g,(a,l,s)=>r[l]?s:""),n=n.replace(/\{\{[^}]+\}\}/g,""),n},ee=async(t,r,n)=>{const a=T();if(!a)throw new Error("AI 配置未找到");if(R(a)&&!a.apiKey)throw new Error("API Key not configured");const l=Z(t,r);if(a.provider==="gateway"){await L({prompt:l},n);return}const s=I(a);try{const i=await s.chat.completions.create({model:a.model,messages:[{role:"user",content:l}],stream:!0});for await(const p of i){const u=p.choices[0]?.delta?.content||"";u&&n(u)}}catch(i){throw console.error("AI Template Generation Error:",i),M(i,a)}};function te(t,r=5){for(const n of E)for(const a of n.subjects)if(a.knowledgePoints.find(s=>s.id===t))return a.knowledgePoints.filter(s=>s.id!==t).slice(0,r);return[]}const re={id:"explain-deep-concept",title:"概念深度讲解",scenario:"explain",icon:"📖",description:"用生活比喻+分步拆解+苏格拉底提问，让学生真正理解概念本质",tags:["启发式","苏格拉底法","生活比喻"],template:`你是一位精通{{student_grade}}教学的名师，擅长用启发式教学法让学生真正理解概念本质。

请深入浅出地讲解"{{knowledge_point}}"这一概念。

{{#if prior_knowledge}}
学生已掌握以下前置知识：{{prior_knowledge}}
请在此基础上搭建理解桥梁。
{{/if}}

讲解要求：
1. 用一个生活比喻引入概念（让学生感到亲切）
2. 分 3-4 个步骤拆解核心逻辑，每一步说明"为什么"
3. 设计 2 个苏格拉底式提问，引导学生自主思考
4. 指出学生常见的误解和易混淆点
5. 用一个简单例题验证理解

{{#if special_request}}
特殊要求：{{special_request}}
{{/if}}

请保持语言亲切生动，适合家长辅导孩子时使用。`,variables:[{key:"knowledge_point",label:"知识点",placeholder:"如：浮力、二次函数、现在完成时...",required:!0,type:"text"},{key:"student_grade",label:"学生年级",placeholder:"如：初二、高一...",required:!0,type:"text"},{key:"prior_knowledge",label:"前置知识（选填）",placeholder:"学生已掌握的相关知识...",required:!1,type:"textarea"},{key:"special_request",label:"特殊要求（选填）",placeholder:"如：用航海举例、侧重实验...",required:!1,type:"text"}],grades:["primary","middle","high"],subjects:["数学","语文","英语","物理","化学","生物"],usageCount:0,rating:4.8,author:"清北名师团队"},ne={id:"explain-story-based",title:"故事化讲解",scenario:"explain",icon:"📚",description:"用完整的故事情节串联知识点，让学习像听故事一样有趣",tags:["故事教学","情境学习","趣味"],template:`你是一位擅长用故事讲知识的名师。请围绕"{{knowledge_point}}"创作一个生动的教学故事。

目标学生：{{student_grade}}

故事要求：
1. 故事主角是一个与学生年龄相仿的孩子
2. 故事自然引入"{{knowledge_point}}"概念
3. 通过主角的探索/困难/发现来展现知识点的本质
4. 故事结束后总结核心知识点
5. 设计一个"故事续写"小任务，让学生运用所学

{{#if special_request}}
特殊要求：{{special_request}}
{{/if}

请保持故事趣味性，适合家长讲给孩子听。`,variables:[{key:"knowledge_point",label:"知识点",placeholder:"如：分数的乘法、浮力...",required:!0,type:"text"},{key:"student_grade",label:"学生年级",placeholder:"如：小学三年级...",required:!0,type:"text"},{key:"special_request",label:"特殊要求（选填）",placeholder:"如：科幻背景、历史故事...",required:!1,type:"text"}],grades:["primary","middle","high"],subjects:["数学","语文","英语","物理","化学","生物","历史"],usageCount:0,rating:4.7,author:"清北名师团队"},ae={id:"explain-socratic",title:"苏格拉底式提问",scenario:"explain",icon:"🤔",description:"通过连环提问引导学生自主发现知识，不给答案",tags:["苏格拉底法","引导发现","高阶思维"],template:`你是一位精通苏格拉底教学法的名师。请针对"{{knowledge_point}}"设计一套连环提问。

目标学生：{{student_grade}}

提问设计原则：
1. 第一层：回忆与激活（你已经知道什么？）
2. 第二层：理解与解释（这是什么意思？用自己的话说）
3. 第三层：应用与迁移（如果...会怎样？）
4. 第四层：分析与比较（这和...有什么不同？为什么？）
5. 第五层：评价与创造（你能设计一个新例子吗？）

每层 2-3 个问题，层层递进，环环相扣。
每个问题后给出"家长引导提示"——当孩子卡住时如何启发。

{{#if prior_knowledge}}
学生已掌握：{{prior_knowledge}}
{{/if}}

请记住：不要直接给答案！用提问引导孩子自己发现。`,variables:[{key:"knowledge_point",label:"知识点",placeholder:"如：光合作用、方程...",required:!0,type:"text"},{key:"student_grade",label:"学生年级",placeholder:"如：初一、高二...",required:!0,type:"text"},{key:"prior_knowledge",label:"前置知识（选填）",placeholder:"学生已掌握的相关知识...",required:!1,type:"textarea"}],grades:["primary","middle","high"],subjects:["数学","语文","英语","物理","化学","生物","历史"],usageCount:0,rating:4.9,author:"清北名师团队"},se={id:"explain-bridge-analogy",title:"桥梁类比法",scenario:"explain",icon:"🌉",description:"用已知知识搭建理解新概念的桥梁，从熟悉到陌生",tags:["类比","脚手架","建构主义"],template:`你是一位擅长用类比教学的名师。请用"桥梁类比法"讲解"{{knowledge_point}}"。

目标学生：{{student_grade}}

讲解结构：
1. **起点**：从学生已知的"{{known_concept}}"出发
2. **搭桥**：找到已知概念与新概念的 3 个连接点
3. **过河**：通过连接点逐步引出新概念的核心
4. **验收**：用 2 道题检验学生是否真正理解
5. **延伸**：这个类比在哪里会"失效"？（避免过度类比）

{{#if special_request}}
特殊要求：{{special_request}}
{{/if}}

请确保类比准确、不误导，适合家长辅导使用。`,variables:[{key:"knowledge_point",label:"新知识点",placeholder:"如：负数、电流、被动语态...",required:!0,type:"text"},{key:"known_concept",label:"已知的类比概念",placeholder:"如：温度、水流、主动语态...",required:!0,type:"text"},{key:"student_grade",label:"学生年级",placeholder:"如：初一...",required:!0,type:"text"},{key:"special_request",label:"特殊要求（选填）",placeholder:"",required:!1,type:"text"}],grades:["middle","high"],subjects:["数学","物理","化学","英语"],usageCount:0,rating:4.6,author:"清北名师团队"},le={id:"explain-visual",title:"可视化讲解",scenario:"explain",icon:"🎨",description:"用思维导图/流程图/对比表等可视化方式呈现知识结构",tags:["可视化","思维导图","结构化"],template:`你是一位擅长可视化教学的名师。请用多种可视化方式呈现"{{knowledge_point}}"的知识结构。

目标学生：{{student_grade}}

可视化要求：
1. **思维导图**：用 Mermaid 语法绘制知识点的思维导图
2. **核心公式/规则**：用表格清晰呈现（含含义和单位）
3. **对比表**：与易混淆概念进行对比（至少 3 个维度）
4. **流程图**：用 Mermaid 语法制订解题步骤流程图

{{#if special_request}}
特殊要求：{{special_request}}
{{/if}}

请确保 Mermaid 语法正确可渲染，适合家长打印出来辅导孩子。`,variables:[{key:"knowledge_point",label:"知识点",placeholder:"如：勾股定理、化学反应速率...",required:!0,type:"text"},{key:"student_grade",label:"学生年级",placeholder:"如：初二...",required:!0,type:"text"},{key:"special_request",label:"特殊要求（选填）",placeholder:"",required:!1,type:"text"}],grades:["middle","high"],subjects:["数学","物理","化学","生物"],usageCount:0,rating:4.7,author:"清北名师团队"},ie={id:"explain-misconception",title:"常见误解剖析",scenario:"explain",icon:"⚠️",description:"针对学生常见错误概念进行正误对比，防患于未然",tags:["误解分析","正误对比","预防性"],template:`你是一位深谙学生思维误区的名师。请针对"{{knowledge_point}}"进行误解剖析。

目标学生：{{student_grade}}

剖析结构：
1. **正确理解**：用简洁语言准确表述概念
2. **5 个常见误解**：
   - 误解内容（学生通常怎么想错的）
   - 错误原因（为什么会这样想）
   - 正确纠正（如何讲清楚）
   - 检验问题（一题辨对错）
3. **教学建议**：家长如何提前预防这些误解
4. **诊断测试**：3 道判断题用于检测孩子是否有这些误解

请确保分析基于真实学情，不要编造不存在的"误解"。`,variables:[{key:"knowledge_point",label:"知识点",placeholder:"如：质量与重量、0.9循环=1...",required:!0,type:"text"},{key:"student_grade",label:"学生年级",placeholder:"如：初二...",required:!0,type:"text"}],grades:["primary","middle","high"],subjects:["数学","物理","化学","生物"],usageCount:0,rating:4.8,author:"清北名师团队"},oe={id:"explain-primary-level",title:"小学知识讲解（故事化版）",scenario:"explain",icon:"📖",description:"用生活比喻+童话故事+动手实验，让小学生听得懂、记得住",tags:["故事化","比喻","动手实验","小学"],gradeLevel:"primary",template:`你是一位资深小学教师，擅长用讲故事的方式让抽象概念变得具体可感。

请为小学生讲解"{{knowledge_point}}"。

讲解要求：
1. **童话故事导入**：用一个 童话故事或动画场景（海绵宝宝、熊出没、喜羊羊等）引入概念
2. **生活比喻**：至少使用 2 个生活中的比喻（超市、游乐园、厨房、学校里的事物）
3. **分 2-3 步拆解**：每步用一句话概括 + 一个具体例子
4. **动手小实验**：设计一个 5 分钟内可完成的小活动（准备材料+操作步骤）
5. **常见错误提醒**：指出 1 个小朋友最容易犯的错误
6. **随堂检验**：出 1 道课堂互动题（不是练习，是边学边问的）

语言要求：
- 使用"我们""让我们一起"等亲切称呼
- 每段不超过 3 句话
- 多用短句，避免长从句
- 适当用 emoji（但不要每句都用）

请保持生动有趣的风格，让 10 岁以下的孩子都能听懂。`,variables:[{key:"knowledge_point",label:"知识点",placeholder:"如：浮力、分数、乘法分配律",required:!0,type:"text"}],grades:["primary"],subjects:["数学","语文","英语","科学","道德与法治"],usageCount:0,rating:5,author:"teacher-team"},de={id:"explain-middle-level",title:"初中知识讲解（逻辑推演版）",scenario:"explain",icon:"📖",description:'从"为什么需要学这个"入手，逻辑清晰、步骤严谨，培养理科思维',tags:["逻辑严谨","步骤拆解","实验探究","初中"],gradeLevel:"middle",template:`你是一位资深初中教师，擅长用逻辑推演和实验探究让学生理解知识的本质。

请为初中生讲解"{{knowledge_point}}"。

讲解要求：
1. **为什么需要学**：先说明这个知识点在现实中的 2 个应用场景（工程/科技/生活），让学生有学习动机
2. **直观感知**：用 1 个生活中的可观察现象建立直觉（而非抽象定义）
3. **逻辑推演**：分 3-4 步推导核心原理，每一步标注"第 N 步"并说明"这一步的依据是..."
4. **实验设计**：设计 1 个简单的验证实验（目的、步骤、预期现象）
5. **易错点**：指出 3 个常见错误理解，并说明为什么错、正确的是什么
6. **中考链接**：简要说明这个知识点在中考中的常见题型和考查深度

语言要求：
- 准确使用学科术语
- 逻辑连接词清晰（因为、所以、因此、由此可见）
- 避免"显然""易证"这类跳过推理的表述`,variables:[{key:"knowledge_point",label:"知识点",placeholder:"如：浮力产生原因、二次函数最值、欧姆定律",required:!0,type:"text"}],grades:["middle"],subjects:["数学","语文","英语","物理","化学","生物"],usageCount:0,rating:5,author:"teacher-team"},ce={id:"explain-high-level",title:"高中知识讲解（深度本质版）",scenario:"explain",icon:"📖",description:"从学科本质和公式推导入手，抽象思维、深度思考，培养研究性思维",tags:["抽象本质","推导过程","学科思维","高中"],gradeLevel:"high",template:`你是一位资深高中教师，擅长从学科高度揭示知识本质，引导学生进行深度思考。

请为高中生讲解"{{knowledge_point}}"。

讲解要求：
1. **学科定位**：说明这个知识点在学科体系中的位置（前置知识 → 本知识点 → 后续应用）
2. **本质探究**：从"为什么要这样定义"入手，给出概念的深层逻辑（而非仅呈现结果）
3. **公式推导**：给出完整推导过程，每一步注明依据（定义/定理/公理）
4. **深度提问**：提出 2 个开放性问题（无标准答案，引导批判性思考）
5. **前沿联系**：简要介绍该知识在现代科技/研究中的 1 个应用或延伸方向
6. **一题多变**：给 1 道核心题，给出 3 种变式思路（不同条件/逆向/综合）

语言要求：
- 术语精确，逻辑严密
- 使用"我们来思考""你有没有想过"引导学生主动思考
- 适当使用符号表达提升严谨性`,variables:[{key:"knowledge_point",label:"知识点",placeholder:"如：导数本质、勒夏特列原理、拓扑连续性",required:!0,type:"text"}],grades:["high"],subjects:["数学","物理","化学","生物","思想政治","历史","地理"],usageCount:0,rating:5,author:"teacher-team"},ue=[re,ne,ae,se,le,ie,oe,de,ce],pe={id:"generate-gradient",title:"梯度出题",scenario:"generate",icon:"📊",description:"生成基础/提高/挑战三档题目，附详细解析",tags:["分层","梯度","系统性"],template:`你是一位命题经验丰富的{{student_grade}}{{subject}}名师。请围绕"{{knowledge_point}}"生成一套梯度练习题。

题目配置：
- 基础题 3 道（直接应用概念，确保信心）
- 提高题 2 道（需要一步转化或综合）
- 挑战题 1 道（需要多步推理或创新思维）

每道题包含：
1. 题目（清晰表述）
2. 解题步骤（详细、分步）
3. 答案与解析
4. 考查点标注

{{#if special_request}}
特殊要求：{{special_request}}
{{/if}}

请确保题目不超纲、表述规范、难度梯度合理。`,variables:[{key:"knowledge_point",label:"知识点",placeholder:"如：一元二次方程...",required:!0,type:"text"},{key:"student_grade",label:"学生年级",placeholder:"如：初三...",required:!0,type:"text"},{key:"subject",label:"学科",placeholder:"如：数学...",required:!0,type:"text"},{key:"special_request",label:"特殊要求（选填）",placeholder:"",required:!1,type:"text"}],grades:["primary","middle","high"],subjects:["数学","语文","英语","物理","化学","生物"],usageCount:0,rating:4.7,author:"清北名师团队"},ge={id:"generate-exam-paper",title:"模拟卷生成",scenario:"generate",icon:"📋",description:"生成一套完整模拟卷，含选择、填空、解答题",tags:["组卷","模拟考","完整卷"],template:`你是一位精通{{student_grade}}教学的{{subject}}名师。请围绕"{{knowledge_point}}"出一套 {{duration}} 分钟的模拟卷。

试卷结构：
- 一、选择题（4 道，每题 3 分）
- 二、填空题（4 道，每题 3 分）
- 三、解答题（2 道，共 20 分）

命题要求：
- 覆盖"{{knowledge_point}}"的核心考点
- 难度分布：基础 60%、提高 30%、挑战 10%
- 每题附参考答案和详细解析
- 写出试卷说明（考查重点、建议时间分配）

请确保题目原创、无超纲内容。`,variables:[{key:"knowledge_point",label:"知识点",placeholder:"如：函数与方程...",required:!0,type:"text"},{key:"student_grade",label:"学生年级",placeholder:"如：高一...",required:!0,type:"text"},{key:"subject",label:"学科",placeholder:"如：数学...",required:!0,type:"text"},{key:"duration",label:"考试时长（分钟）",placeholder:"如：60、90...",required:!0,type:"text"}],grades:["middle","high"],subjects:["数学","语文","英语","物理","化学","生物"],usageCount:0,rating:4.6,author:"清北名师团队"},me={id:"generate-mistake-focused",title:"易错题专项",scenario:"generate",icon:"🎯",description:"针对常见易错点设计题目，让孩子在错误中学习",tags:["易错","避坑","针对性"],template:`你是一位深谙学生易错点的名师。请针对"{{knowledge_point}}"的常见易错点设计专项练习。

目标学生：{{student_grade}}

题目设计：
1. 列出该知识点的 5 个典型易错点
2. 每个易错点配 1 道"陷阱题"（看似简单但容易做错）
3. 每道题详细解析"为什么会错"和"如何避免"
4. 最后出 2 道综合题检验是否真正掌握

请确保陷阱设计巧妙但不过分刁钻，目的是加深理解而非为难学生。`,variables:[{key:"knowledge_point",label:"知识点",placeholder:"如：分式方程、化学方程式...",required:!0,type:"text"},{key:"student_grade",label:"学生年级",placeholder:"如：初三...",required:!0,type:"text"}],grades:["middle","high"],subjects:["数学","物理","化学"],usageCount:0,rating:4.8,author:"清北名师团队"},he={id:"generate-concept-check",title:"概念诊断",scenario:"generate",icon:"🔬",description:"5 道精题快速诊断概念理解程度，定位薄弱点",tags:["诊断","快速","定位薄弱"],template:`你是一位擅长学情诊断的名师。请针对"{{knowledge_point}}"设计一套 5 题概念诊断卷。

目标学生：{{student_grade}}

诊断设计：
- 第 1 题：概念识别（能否辨认）
- 第 2 题：概念理解（能否解释）
- 第 3 题：概念辨析（能否区分相似概念）
- 第 4 题：概念应用（能否解决简单问题）
- 第 5 题：概念迁移（能否解决变式问题）

每题后给出：
- 做对说明：该维度已掌握
- 做错说明：该维度需要加强 + 具体建议

最后给出整体评估：掌握程度（初阶/中阶/高阶）和后续学习建议。`,variables:[{key:"knowledge_point",label:"知识点",placeholder:"如：密度、函数单调性...",required:!0,type:"text"},{key:"student_grade",label:"学生年级",placeholder:"如：初二...",required:!0,type:"text"}],grades:["middle","high"],subjects:["数学","物理","化学","生物"],usageCount:0,rating:4.7,author:"清北名师团队"},xe={id:"generate-challenge",title:"思维挑战",scenario:"generate",icon:"🏆",description:"设计开放性、探究性的高阶思维题目，培养创新能力",tags:["挑战","开放","高阶思维"],template:`你是一位擅长培养学生高阶思维的名师。请围绕"{{knowledge_point}}"设计思维挑战题。

目标学生：{{student_grade}}

挑战题设计：
1. **开放探究题**（1 道）：条件开放或结论开放，需要学生自己探索
2. **实际建模题**（1 道）：将知识点应用到真实情境中建模求解
3. **跨学科题**（1 道）：融合其他学科知识解决问题

每题包含：
- 题目（情境化、有挑战但可解）
- 解题思路提示（分层次：金钥匙→银钥匙→铜钥匙）
- 参考解答
- 拓展思考（如果改变某个条件会怎样？）

请确保题目有"跳一跳够得着"的难度，激发思考而非打击信心。`,variables:[{key:"knowledge_point",label:"知识点",placeholder:"如：概率、能量守恒...",required:!0,type:"text"},{key:"student_grade",label:"学生年级",placeholder:"如：高一...",required:!0,type:"text"}],grades:["middle","high"],subjects:["数学","物理","化学","生物"],usageCount:0,rating:4.9,author:"清北名师团队"},be={id:"generate-adaptive",title:"自适应出题",scenario:"generate",icon:"🔄",description:"根据学生答题情况动态调整难度的出题策略",tags:["自适应","动态","个性化"],template:`你是一位精通自适应学习的名师。请为"{{knowledge_point}}"设计一套自适应出题方案。

目标学生：{{student_grade}}，当前水平：{{current_level}}

自适应策略：
1. **初始评估**：3 道题快速定位学生水平
2. **动态调整规则**：
   - 连续 2 题正确 → 难度提升一档
   - 连续 2 题错误 → 难度降低一档 + 给出知识点复习提示
   - 1 对 1 错 → 保持当前难度
3. **终止条件**：连续 3 题正确（达标）或完成 10 题
4. **输出最终评估报告**：掌握度、薄弱点、建议

请生成初始 3 道评估题，并说明后续出题策略。`,variables:[{key:"knowledge_point",label:"知识点",placeholder:"如：因式分解...",required:!0,type:"text"},{key:"student_grade",label:"学生年级",placeholder:"如：初二...",required:!0,type:"text"},{key:"current_level",label:"当前水平",placeholder:"基础/中等/优秀",required:!0,type:"select",options:["基础","中等","优秀"]}],grades:["middle","high"],subjects:["数学","物理","化学"],usageCount:0,rating:4.6,author:"清北名师团队"},ye={id:"generate-primary-level",title:"小学出题（趣味生活版）",scenario:"generate",icon:"🎪",description:"题目场景生活化（超市/游乐园/家庭/学校），题型趣味化，让孩子做题像闯关",tags:["生活场景","趣味化","基础+挑战","小学"],gradeLevel:"primary",template:`你是一位资深小学教师，擅长把练习题包装成孩子感兴趣的生活场景，让孩子在做题中感受知识的力量。

请为小学生（{{student_grade}}）围绕"{{knowledge_point}}"出 5 道练习题。

出题要求：
1. **场景化题干**：每道题设置一个生活场景（超市购物、游乐园、家庭厨房、学校课堂等），孩子读题就像读小故事
2. **难度梯度**：
   - 基础题 2 道（直接应用概念，确保信心）
   - 中等题 2 道（需要一步思考或转化）
   - 挑战题 1 道（需要两步思考或逆向思维）
3. **题型搭配**：至少包含选择题、判断题、填空题中的 2 种（如：2 选择 + 2 判断 + 1 填空）
4. **题干要求**：简短清晰，小学生一读就懂；避免复杂从句；贴合孩子生活经验
5. **数值范围**：数字和计算量适合该年级水平（如小学三年级以内不超过三位数加减、表内乘除）
6. **答案与解析**：每题附（1）正确答案（2）1-2 句话解析，说清"为什么是这个答案"
7. **鼓励语**：最后附一句鼓励孩子的话（具体、真诚，不空洞）

语言要求：
- 题干生动有趣，多用口语化表达
- 鼓励孩子思考："你知道为什么吗""试试看"
- 避免说教口吻

让做题像闯关游戏，让孩子愿意做、做完还想做。`,variables:[{key:"knowledge_point",label:"知识点",placeholder:"如：乘法口诀、分数初步、认识人民币",required:!0,type:"text"},{key:"student_grade",label:"学生年级",placeholder:"如：小学三年级",required:!0,type:"text"}],grades:["primary"],subjects:["数学","语文","英语","科学","道德与法治"],usageCount:0,rating:5,author:"teacher-team"},je={id:"generate-middle-level",title:"初中出题（工程应用版）",scenario:"generate",icon:"🏗️",description:"题目工程应用化（建筑/交通/通信/医疗），多步推理，培养知识迁移能力",tags:["工程应用","多步推理","知识迁移","初中"],gradeLevel:"middle",template:`你是一位资深初中教师，擅长命制工程应用类试题，让学生感受知识在真实世界中的价值。

请为初中生（{{student_grade}}）围绕"{{knowledge_point}}"出 5 道应用题。

出题要求：
1. **工程场景**：每题设置真实的工程或技术场景（建筑工程、交通运输、通信技术、医疗诊断、环境保护等），场景描述要专业但通俗
2. **难度梯度**：
   - 基础题 2 道（直接套用概念或公式）
   - 提高题 2 道（需要一步转化或综合应用）
   - 挑战题 1 道（多步推理、逆向思维或开放性问题）
3. **推理要求**：每题至少需要 2 步推理，体现"理解→应用→分析"的过程
4. **数值设计**：数据要符合实际（如桥梁承重、药品剂量、信号速率不能脱离现实），计算量控制在初中生可完成范围
5. **题干表述**：准确规范、无歧义；必要的已知条件清晰列出；避免无关干扰信息
6. **完整解答**：每题附（1）解题思路（先想什么、再做什么）（2）详细解题步骤（3）最终答案（4）易错点提醒
7. **中考对标**：简要说明该类题在中考中的常见题型和分值

语言要求：
- 准确使用学科术语
- 逻辑清晰，层次分明
- 鼓励多角度思考

让解题成为一次小型工程实践，让学生既练思维又长见识。`,variables:[{key:"knowledge_point",label:"知识点",placeholder:"如：欧姆定律、一元二次方程应用、浮力计算",required:!0,type:"text"},{key:"student_grade",label:"学生年级",placeholder:"如：初二",required:!0,type:"text"}],grades:["middle"],subjects:["数学","语文","英语","物理","化学","生物"],usageCount:0,rating:5,author:"teacher-team"},ke={id:"generate-high-level",title:"高中出题（综合建模版）",scenario:"generate",icon:"🚀",description:"题目科技前沿化（AI/航天/基因/新能源），综合建模，体现学科思维深度",tags:["科技前沿","综合建模","学科深度","高中"],gradeLevel:"high",template:`你是一位资深高中教师，擅长命制体现学科本质和科技前沿的综合建模试题，命题风格对标高考压轴题和强基校测。

请为高中生（{{student_grade}}）围绕"{{knowledge_point}}"出 5 道综合题。

出题要求：
1. **前沿场景**：每题设置科技前沿或科学研究情境（人工智能、航天工程、基因编辑、新能源技术、量子计算等），提供必要的背景信息，场景描述严谨专业
2. **难度梯度**：
   - 基础题 1 道（单一概念的理解和应用）
   - 提高题 2 道（需要综合多个知识点或数学建模）
   - 挑战题 2 道（跨知识模块综合、开放性探究、或需构造性思维，对标高考压轴题水平）
3. **建模要求**：每题需建立数学模型或逻辑模型，体现"实际问题→抽象→求解→验证"的完整思维链
4. **信息完整性**：题干给出充分且必要的条件和数据（含必要的物理常数、化学式量等）；避免冗余无关信息
5. **解题过程**：每题附（1）建模思路（如何建立模型）（2）完整求解过程（关键步骤）（3）最终答案或结论（4）思维延伸（可追问什么）
6. **学科思维**：在最后一题后，用 2-3 句话点评本组题体现了哪些学科思想方法（如：函数与方程、分类讨论、数形结合、极限思想）

语言要求：
- 术语精确，逻辑严密
- 符号表达规范（数学式、化学方程式、物理量符号）
- 题干信息完整、表述无歧义

让试题成为一次前沿探索，激发学生的求知欲和挑战精神。`,variables:[{key:"knowledge_point",label:"知识点",placeholder:"如：导数与优化、电磁感应综合、化学平衡移动",required:!0,type:"text"},{key:"student_grade",label:"学生年级",placeholder:"如：高二",required:!0,type:"text"}],grades:["high"],subjects:["数学","物理","化学","生物","思想政治","历史","地理"],usageCount:0,rating:5,author:"teacher-team"},_e=[pe,ge,me,he,xe,be,ye,je,ke],ve={id:"assess-answer-review",title:"作答点评",scenario:"assess",icon:"✍️",description:"对学生答案给出专业点评和改进建议",tags:["点评","反馈","改进"],template:`你是一位{{student_grade}}{{subject}}名师。请对学生的作答进行专业点评。

题目：{{question}}

学生答案：{{student_answer}}

点评要求：
1. 先肯定学生答对的部分（哪怕只有一点点）
2. 指出具体错误（不是"你错了"，而是"这一步的思路有个小偏差"）
3. 分析错误原因（概念误解/计算失误/审题不清/方法不当）
4. 给出改进建议和类似题目的解题策略
5. 用鼓励性语言结尾，保护学生学习积极性

请保持语气亲切、建议具体可操作。`,variables:[{key:"question",label:"题目",placeholder:"请输入题目内容...",required:!0,type:"textarea"},{key:"student_answer",label:"学生答案",placeholder:"请输入学生作答内容...",required:!0,type:"textarea"},{key:"student_grade",label:"学生年级",placeholder:"如：初二...",required:!0,type:"text"},{key:"subject",label:"学科",placeholder:"如：数学...",required:!0,type:"text"}],grades:["primary","middle","high"],subjects:["数学","语文","英语","物理","化学","生物"],usageCount:0,rating:4.8,author:"清北名师团队"},fe={id:"assess-rubric-based",title:"量规评分",scenario:"assess",icon:"📏",description:"按评分量规给出分维度评价和总分",tags:["量规","分维度","客观"],template:`你是一位{{student_grade}}{{subject}}名师。请按以下评分量规对学生作答进行评价。

题目：{{question}}

学生答案：{{student_answer}}

评分量规：
1. **知识理解**（0-3分）：是否准确理解题目涉及的概念和原理
2. **解题过程**（0-3分）：解题步骤是否完整、逻辑是否清晰
3. **计算准确性**（0-2分）：计算过程是否正确、结果是否准确
4. **表达规范性**（0-2分）：书写是否规范、术语使用是否正确

请给出：
- 每个维度的得分和扣分原因
- 总分（满分10分）
- 等级评定（优秀/良好/合格/需改进）
- 各维度的改进建议`,variables:[{key:"question",label:"题目",placeholder:"请输入题目内容...",required:!0,type:"textarea"},{key:"student_answer",label:"学生答案",placeholder:"请输入学生作答内容...",required:!0,type:"textarea"},{key:"student_grade",label:"学生年级",placeholder:"如：初二...",required:!0,type:"text"},{key:"subject",label:"学科",placeholder:"如：数学...",required:!0,type:"text"}],grades:["primary","middle","high"],subjects:["数学","语文","英语","物理","化学","生物"],usageCount:0,rating:4.7,author:"清北名师团队"},we={id:"assess-peer-review",title:"互评引导",scenario:"assess",icon:"🤝",description:"引导学生互相批改、学习他人思路",tags:["互评","合作","多元视角"],template:`你是一位擅长合作学习的名师。请设计一份"同伴互评指南"，引导学生互相批改作业。

题目：{{question}}

学生答案A：{{answer_a}}

学生答案B：{{answer_b}}

互评指南设计：
1. **评分标准**：给出清晰的打分规则（让学生能操作）
2. **亮点发现**：每个答案至少找出 2 个值得学习的地方
3. **问题指出**：用"我建议..."代替"你错了"
4. **思路对比**：比较两种解法的异同，哪个更巧妙？
5. **改进建议**：针对每个答案给出具体的优化方向
6. **反思问题**："从同学的解法中学到了什么？"

请确保互评标准具体可操作，适合{{student_grade}}学生使用。`,variables:[{key:"question",label:"题目",placeholder:"请输入题目内容...",required:!0,type:"textarea"},{key:"answer_a",label:"学生A答案",placeholder:"第一位同学的作答...",required:!0,type:"textarea"},{key:"answer_b",label:"学生B答案",placeholder:"第二位同学的作答...",required:!0,type:"textarea"},{key:"student_grade",label:"学生年级",placeholder:"如：初二...",required:!0,type:"text"}],grades:["middle","high"],subjects:["数学","语文","英语","物理","化学","生物"],usageCount:0,rating:4.6,author:"清北名师团队"},qe={id:"assess-self-assessment",title:"自我反思",scenario:"assess",icon:"🪞",description:"引导学生自我检查和反思学习过程",tags:["元认知","反思","自主学习"],template:`你是一位擅长培养元认知能力的名师。请设计一套引导学生自我反思的问卷和指南。

学习内容：{{knowledge_point}}
目标学生：{{student_grade}}

反思指南设计：
1. **知识自查清单**（5 个问题）：学生可以自问自答，检查是否真正掌握
2. **思维过程回顾**：
   - 我是怎么想到这个解法的？
   - 有没有其他方法？
   - 这个方法和之前学的有什么联系？
3. **自我评价表**：让学生从"理解深度""应用能力""表达规范"三个维度自评
4. **错因分析框架**：如果做错了，是哪个环节出了问题？
5. **下一步计划**：基于自评，制定 2-3 条具体的改进措施

请确保反思问题能引导学生深入思考，而非简单回答"会了/没会"。`,variables:[{key:"knowledge_point",label:"学习内容",placeholder:"如：勾股定理、化学反应速率...",required:!0,type:"text"},{key:"student_grade",label:"学生年级",placeholder:"如：初二...",required:!0,type:"text"}],grades:["primary","middle","high"],subjects:["数学","语文","英语","物理","化学","生物"],usageCount:0,rating:4.8,author:"清北名师团队"},Ne={id:"assess-progress-check",title:"阶段检测",scenario:"assess",icon:"📈",description:"单元/阶段知识掌握情况检测",tags:["检测","阶段性","查漏补缺"],template:`你是一位擅长学情诊断的{{student_grade}}{{subject}}名师。请围绕"{{knowledge_point}}"设计一套阶段检测方案。

检测设计：
1. **知识点清单**：列出本单元所有核心知识点
2. **分层检测题**：
   - 基础过关（3 道）：覆盖所有核心知识点
   - 综合应用（2 道）：跨知识点综合
   - 拓展挑战（1 道）：需要高阶思维
3. **掌握度判定标准**：
   - 全部正确：优秀 ✓✓✓
   - 基础全对+综合部分对：良好 ✓✓
   - 基础部分对：合格 ✓
   - 基础多错：需要补习 ✗
4. **薄弱点定位**：错题对应到具体知识点
5. **补救方案**：每个薄弱点配 1 道补救题

请确保检测覆盖全面、难度梯度合理。`,variables:[{key:"knowledge_point",label:"单元知识点",placeholder:"如：第一单元 有理数...",required:!0,type:"text"},{key:"student_grade",label:"学生年级",placeholder:"如：初一...",required:!0,type:"text"},{key:"subject",label:"学科",placeholder:"如：数学...",required:!0,type:"text"}],grades:["primary","middle","high"],subjects:["数学","语文","英语","物理","化学","生物"],usageCount:0,rating:4.7,author:"清北名师团队"},Pe={id:"assess-oral-defense",title:"口述答辩",scenario:"assess",icon:"🎤",description:"通过口述方式检验理解深度",tags:["口述","理解深度","表达能力"],template:`你是一位擅长口述答辩评估的名师。请设计一套"口述答辩"方案，通过让学生讲解来检验理解深度。

学习内容：{{knowledge_point}}
目标学生：{{student_grade}}

答辩方案设计：
1. **热身问题**（1 个）：简单问题让学生进入状态
2. **核心问题**（3 个）：
   - "请用自己的话解释这个概念"（理解）
   - "举一个生活中的例子"（应用）
   - "如果...会怎样？"（迁移）
3. **追问策略**：每个问题后的深入追问方向
4. **评价标准**：
   - 准确性：表述是否正确
   - 深度：是否触及本质
   - 灵活性：能否举一反三
5. **家长引导提示**：如何追问、如何判断孩子是否真懂

请确保问题能区分"死记硬背"和"真正理解"。`,variables:[{key:"knowledge_point",label:"学习内容",placeholder:"如：光合作用...",required:!0,type:"text"},{key:"student_grade",label:"学生年级",placeholder:"如：初一...",required:!0,type:"text"}],grades:["primary","middle","high"],subjects:["数学","语文","英语","物理","化学","生物"],usageCount:0,rating:4.6,author:"清北名师团队"},Ce=[ve,fe,we,qe,Ne,Pe],Se={id:"plan-weekly",title:"周学习计划",scenario:"plan",icon:"📅",description:"制定一周的每日学习安排",tags:["周计划","日常","可执行"],template:`你是一位擅长学习规划的{{student_grade}}{{subject}}名师。请为孩子制定一份可执行的周学习计划。

学习内容：{{knowledge_point}}
当前水平：{{current_level}}
每周可用时间：{{hours_per_week}} 小时

计划要求：
1. **周一到周五**：每天 15-30 分钟的微学习任务
   - 具体任务（不是"复习数学"，而是"完成 5 道分式计算题"）
   - 预估时间
   - 检验方式
2. **周六**：本周知识整合 + 错题回顾（45-60 分钟）
3. **周日**：拓展应用或休息调整
4. **弹性机制**：如果某天没完成，如何调整？
5. **激励设计**：周末达成目标的小奖励建议

请确保任务具体、时间合理、可操作性强。`,variables:[{key:"knowledge_point",label:"学习内容",placeholder:"如：一元二次方程...",required:!0,type:"text"},{key:"student_grade",label:"学生年级",placeholder:"如：初三...",required:!0,type:"text"},{key:"subject",label:"学科",placeholder:"如：数学...",required:!0,type:"text"},{key:"current_level",label:"当前水平",placeholder:"基础/中等/优秀",required:!0,type:"select",options:["基础","中等","优秀"]},{key:"hours_per_week",label:"每周可用时间（小时）",placeholder:"如：5、10...",required:!0,type:"text"}],grades:["primary","middle","high"],subjects:["数学","语文","英语","物理","化学","生物"],usageCount:0,rating:4.8,author:"清北名师团队"},Fe={id:"plan-exam-prep",title:"备考计划",scenario:"plan",icon:"🎯",description:"考前冲刺复习计划",tags:["备考","冲刺","高效"],template:`你是一位备考经验丰富的{{student_grade}}{{subject}}名师。请制定一份考前冲刺计划。

考试范围：{{knowledge_point}}
距离考试：{{days_until_exam}} 天
当前水平：{{current_level}}

冲刺计划：
1. **知识扫描**（前 1/3 时间）：
   - 列出所有考点及其权重
   - 标记掌握/薄弱/未学
   - 薄弱点优先复习
2. **专项突破**（中 1/3 时间）：
   - 每个薄弱点配专项练习
   - 难度从基础到提高
   - 每日检测是否突破
3. **模拟冲刺**（后 1/3 时间）：
   - 限时模拟练习
   - 错题回顾
   - 考试策略指导
4. **每日时间分配**：具体时间安排表
5. **考前一天**：做什么、不做什么

请确保计划紧凑高效、重点突出。`,variables:[{key:"knowledge_point",label:"考试范围",placeholder:"如：第一至三章...",required:!0,type:"text"},{key:"student_grade",label:"学生年级",placeholder:"如：初三...",required:!0,type:"text"},{key:"subject",label:"学科",placeholder:"如：数学...",required:!0,type:"text"},{key:"days_until_exam",label:"距离考试（天）",placeholder:"如：7、14、30...",required:!0,type:"text"},{key:"current_level",label:"当前水平",placeholder:"基础/中等/优秀",required:!0,type:"select",options:["基础","中等","优秀"]}],grades:["middle","high"],subjects:["数学","语文","英语","物理","化学","生物"],usageCount:0,rating:4.9,author:"清北名师团队"},Ae={id:"plan-summer",title:"假期规划",scenario:"plan",icon:"🏖️",description:"寒暑假长期学习规划",tags:["假期","长期","劳逸结合"],template:`你是一位擅长长期学习规划的名师。请为孩子制定一份{{break_type}}学习规划。

年级：{{student_grade}}
薄弱科目：{{weak_subjects}}
新学期重点：{{next_term_focus}}

规划框架：
1. **恢复期**（前 3-5 天）：调整作息，回顾上学期重点
2. **巩固期**（第 1-2 周）：
   - 每天 30 分钟复习上学期薄弱点
   - 每周 1 次综合检测
3. **预习期**（中间 2-3 周）：
   - 新学期重点知识的预习
   - 不求精通，建立整体认知
4. **拓展期**（穿插进行）：
   - 阅读、实验、项目式学习
   - 保持学习兴趣
5. **收心期**（开学前 1 周）：
   - 调整作息到上学模式
   - 新学期目标设定

每日时间表模板 + 弹性调整机制 + 劳逸结合建议。`,variables:[{key:"student_grade",label:"学生年级",placeholder:"如：初二...",required:!0,type:"text"},{key:"break_type",label:"假期类型",placeholder:"暑假/寒假",required:!0,type:"select",options:["暑假","寒假"]},{key:"weak_subjects",label:"薄弱科目",placeholder:"如：数学物理...",required:!0,type:"text"},{key:"next_term_focus",label:"新学期重点",placeholder:"如：初三中考冲刺...",required:!0,type:"text"}],grades:["primary","middle","high"],subjects:["数学","语文","英语","物理","化学","生物"],usageCount:0,rating:4.7,author:"清北名师团队"},Ee={id:"plan-weak-point",title:"弱项攻坚",scenario:"plan",icon:"💪",description:"针对薄弱知识点的专项攻坚计划",tags:["弱项","专项","突破"],template:`你是一位擅长针对性辅导的名师。请为"{{knowledge_point}}"制定专项攻坚计划。

目标学生：{{student_grade}}
当前问题：{{problem_description}}
可用时间：{{available_time}}

攻坚计划：
1. **诊断测试**（10 分钟）：3 道题定位具体薄弱点
2. **根因分析**：是概念不理解？还是不会应用？还是计算易错？
3. **分步突破方案**：
   - 第 1 步：概念重建（用什么方式讲清楚）
   - 第 2 步：基础练习（3-5 道，确保能做对）
   - 第 3 步：变式训练（2-3 道，检验是否真会）
   - 第 4 步：综合应用（1-2 道，看能否迁移）
4. **时间节点**：每天做什么、预期多久突破
5. **检验标准**：用什么标准判定"已经突破"
6. **防复发策略**：如何避免再次遗忘

请确保计划针对性强、步骤清晰。`,variables:[{key:"knowledge_point",label:"薄弱知识点",placeholder:"如：分式方程应用题...",required:!0,type:"text"},{key:"student_grade",label:"学生年级",placeholder:"如：初三...",required:!0,type:"text"},{key:"problem_description",label:"具体问题",placeholder:"如：遇到应用题不会列方程...",required:!0,type:"textarea"},{key:"available_time",label:"可用时间",placeholder:"如：每天 30 分钟，共 2 周...",required:!0,type:"text"}],grades:["primary","middle","high"],subjects:["数学","语文","英语","物理","化学","生物"],usageCount:0,rating:4.8,author:"清北名师团队"},Te={id:"plan-habit-building",title:"习惯养成",scenario:"plan",icon:"🌱",description:"培养良好学习习惯的 21 天计划",tags:["习惯","21天","养成"],template:`你是一位擅长习惯培养的教育专家。请设计一份 21 天学习习惯养成计划。

目标习惯：{{target_habit}}
学生年级：{{student_grade}}
当前情况：{{current_status}}

21 天计划设计：
1. **第 1-7 天（启动期）**：
   - 最小可行行动（每天只需 5-10 分钟）
   - 降低启动门槛
   - 每日打卡追踪
2. **第 8-14 天（适应期）**：
   - 逐步增加难度/时长
   - 加入变化保持新鲜感
   - 每周小奖励
3. **第 15-21 天（巩固期）**：
   - 形成固定流程
   - 自我监控取代外部监督
   - 庆祝完成

配套工具：
- 每日打卡表
- 家长监督指南
- 遇到困难时的应对策略
- 21 天后的维持方案`,variables:[{key:"target_habit",label:"目标习惯",placeholder:"如：每天做 5 道计算题、课前预习...",required:!0,type:"text"},{key:"student_grade",label:"学生年级",placeholder:"如：小学四年级...",required:!0,type:"text"},{key:"current_status",label:"当前情况",placeholder:"如：完全没习惯/偶尔做/坚持不下来...",required:!0,type:"textarea"}],grades:["primary","middle","high"],subjects:["数学","语文","英语","物理","化学","生物"],usageCount:0,rating:4.6,author:"清北名师团队"},Le={id:"plan-milestone",title:"里程碑规划",scenario:"plan",icon:"🏁",description:"学期/学年学习目标和里程碑",tags:["里程碑","目标","长期规划"],template:`你是一位擅长长期学习规划的名师。请制定一份学期/学年学习里程碑规划。

学生年级：{{student_grade}}
学科：{{subject}}
当前水平：{{current_level}}
目标水平：{{target_level}}

里程碑规划：
1. **学期目标**：用具体、可衡量的语言描述
2. **月度里程碑**（每月 1 个关键成果）：
   - 第 1 月：...
   - 第 2 月：...
   - ...
3. **每周任务**：每月里程碑拆解为每周可执行任务
4. **检测方式**：每个里程碑如何验证是否达成
5. **调整机制**：如果落后了怎么追赶？如果超前了如何拓展？
6. **激励设计**：每个里程碑达成后的庆祝方式

请确保目标既有挑战性又可达成，里程碑清晰可衡量。`,variables:[{key:"student_grade",label:"学生年级",placeholder:"如：初二...",required:!0,type:"text"},{key:"subject",label:"学科",placeholder:"如：数学...",required:!0,type:"text"},{key:"current_level",label:"当前水平",placeholder:"如：班级中等...",required:!0,type:"text"},{key:"target_level",label:"目标水平",placeholder:"如：班级前 10...",required:!0,type:"text"}],grades:["primary","middle","high"],subjects:["数学","语文","英语","物理","化学","生物"],usageCount:0,rating:4.7,author:"清北名师团队"},Re=[Se,Fe,Ae,Ee,Te,Le],Ie={id:"error-root-cause",title:"根因分析",scenario:"error-analysis",icon:"🔍",description:"深挖错题的根本原因",tags:["根因","深度","治本"],template:`你是一位擅长错题分析的名师。请对这道错题进行根因分析。

题目：{{question}}
学生答案：{{student_answer}}
正确答案：{{correct_answer}}

分析框架：
1. **直接错误**：学生具体错在哪里？
2. **错误类型**：
   - 概念性错误（对概念理解有误）
   - 计算性错误（计算过程出错）
   - 方法性错误（选用方法不当）
   - 审题性错误（理解题意有误）
   - 习惯性错误（抄错、漏写等）
3. **深层原因**：为什么会出现这个错误？（用"5 Why分析法"思路追问）
4. **关联漏洞**：这个错误反映出哪些知识点的薄弱？
5. **纠正策略**：如何从根本上解决这个问题？
6. **预防方法**：以后如何避免同类错误？`,variables:[{key:"question",label:"题目",placeholder:"请输入题目...",required:!0,type:"textarea"},{key:"student_answer",label:"学生答案",placeholder:"请输入学生的错误答案...",required:!0,type:"textarea"},{key:"correct_answer",label:"正确答案",placeholder:"请输入正确答案...",required:!0,type:"textarea"}],grades:["primary","middle","high"],subjects:["数学","语文","英语","物理","化学","生物"],usageCount:0,rating:4.9,author:"清北名师团队"},Me={id:"error-concept-gap",title:"概念缺口",scenario:"error-analysis",icon:"🕳️",description:"识别错题背后的概念理解漏洞",tags:["概念","漏洞","补缺"],template:`你是一位擅长诊断学习漏洞的名师。请分析错题背后隐藏的概念缺口。

题目：{{question}}
学生答案：{{student_answer}}
所涉知识点：{{knowledge_point}}

分析框架：
1. **解题所需的知识链**：列出解决这道题需要的所有前置概念
2. **缺口定位**：学生在哪个概念环节出了问题？
3. **缺口类型**：
   - 完全没学过
   - 学过但遗忘了
   - 理解不完整
   - 和其他概念混淆了
4. **概念重建方案**：用简洁语言重新讲解这个概念
5. **验证理解**：1 道题检验学生是否真正补上了这个缺口
6. **知识网络修复**：这个概念和哪些其他概念有关联？`,variables:[{key:"question",label:"题目",placeholder:"请输入题目...",required:!0,type:"textarea"},{key:"student_answer",label:"学生答案",placeholder:"请输入学生的错误答案...",required:!0,type:"textarea"},{key:"knowledge_point",label:"所涉知识点",placeholder:"如：勾股定理...",required:!0,type:"text"}],grades:["primary","middle","high"],subjects:["数学","语文","英语","物理","化学","生物"],usageCount:0,rating:4.8,author:"清北名师团队"},Oe={id:"error-thinking-path",title:"思维路径",scenario:"error-analysis",icon:"🧠",description:"还原学生解题的思维过程，找到卡点",tags:["思维","过程","诊断"],template:`你是一位擅长思维诊断的名师。请还原学生解题的思维过程并找到卡点。

题目：{{question}}
学生答案：{{student_answer}}
学生自述（可选）：{{student_thought}}

分析框架：
1. **思维路径还原**：
   - 学生是从哪个角度切入的？
   - 每一步推理是什么？
   - 在哪里开始偏离正确方向？
2. **卡点定位**：
   - 具体卡在哪一步？
   - 为什么会卡住？（知识盲点/思维定势/经验不足）
3. **思维偏差类型**：
   - 过度概括
   - 遗漏条件
   - 隐含假设错误
   - 类比不当
4. **思维纠正**：如何引导学生发现自己的思维偏差？
5. **类似情境**：还有哪些题目容易触发同样的思维偏差？`,variables:[{key:"question",label:"题目",placeholder:"请输入题目...",required:!0,type:"textarea"},{key:"student_answer",label:"学生答案",placeholder:"请输入学生的作答...",required:!0,type:"textarea"},{key:"student_thought",label:"学生自述（选填）",placeholder:"学生对自己解题过程的描述...",required:!1,type:"textarea"}],grades:["middle","high"],subjects:["数学","物理","化学","生物"],usageCount:0,rating:4.7,author:"清北名师团队"},Ge={id:"error-transfer-practice",title:"变式迁移",scenario:"error-analysis",icon:"🔄",description:"通过变式题检验是否真正掌握",tags:["变式","迁移","举一反三"],template:`你是一位擅长变式教学的名师。请基于学生的错题设计变式练习。

原题：{{question}}
学生错误：{{student_answer}}

变式设计：
1. **数据变式**：只改数据，考查是否会做同样的题
2. **条件变式**：改变一个条件，看学生能否适应
3. **逆向变式**：从结论反推条件
4. **情境变式**：换一个新情境，考查迁移能力
5. **综合变式**：融合多个知识点

每道变式题包含：
- 题目
- 解题提示（如果学生又卡住了）
- 详细解析
- 与原题的关联说明

最后给出一个总体判断：学生是"真的会了"还是"只是记住了答案"。`,variables:[{key:"question",label:"原题",placeholder:"请输入题目...",required:!0,type:"textarea"},{key:"student_answer",label:"学生错误",placeholder:"请输入学生的错误答案...",required:!0,type:"textarea"}],grades:["primary","middle","high"],subjects:["数学","语文","英语","物理","化学","生物"],usageCount:0,rating:4.8,author:"清北名师团队"},Be={id:"error-meta-cognition",title:"元认知训练",scenario:"error-analysis",icon:"🧘",description:"培养学生对自身思考的监控能力",tags:["元认知","自我监控","高阶"],template:`你是一位擅长元认知训练的名师。请设计一套元认知训练方案，帮助学生学会监控自己的思考。

题目：{{question}}
学生答案：{{student_answer}}

元认知训练设计：
1. **做题前的思考**（计划）：
   - 这道题考查什么知识点？
   - 我打算用什么方法？
   - 有什么需要注意的陷阱？
2. **做题中的思考**（监控）：
   - 我的每一步都有依据吗？
   - 有没有其他可能？
   - 如果卡住了怎么办？
3. **做题后的思考**（评估）：
   - 我的答案合理吗？
   - 有没有检查？
   - 我能在脑子里"复盘"整个过程吗？
4. **错题反思模板**：引导学生建立错题反思的习惯
5. **元认知提问清单**：日常可用的自我提问列表`,variables:[{key:"question",label:"题目",placeholder:"请输入题目...",required:!0,type:"textarea"},{key:"student_answer",label:"学生答案",placeholder:"请输入学生的作答...",required:!0,type:"textarea"}],grades:["middle","high"],subjects:["数学","语文","英语","物理","化学","生物"],usageCount:0,rating:4.6,author:"清北名师团队"},Ke={id:"error-pattern",title:"错误模式",scenario:"error-analysis",icon:"📊",description:"识别学生反复出现的错误模式",tags:["模式","规律","预防"],template:`你是一位擅长学情分析的名师。请分析学生的错题集，识别反复出现的错误模式。

错题列表：
{{error_list}}
学生年级：{{student_grade}}

分析框架：
1. **模式识别**：
   - 哪些错误反复出现？（至少分析 3 个模式）
   - 每个模式的出现频率
2. **模式分类**：
   - 知识型错误（某个知识点总是错）
   - 方法型错误（某类方法总是用错）
   - 习惯型错误（抄错、漏写、看错）
   - 心理型错误（难题放弃、简单题粗心）
3. **深层原因**：为什么会形成这些模式？
4. **干预方案**：每个模式对应一个具体的纠正策略
5. **预防机制**：如何在日常学习中打破这些模式
6. **家长配合**：家长可以做什么来帮助孩子`,variables:[{key:"error_list",label:"错题列表",placeholder:"请输入错题（题目+学生答案），每题一行...",required:!0,type:"textarea"},{key:"student_grade",label:"学生年级",placeholder:"如：初二...",required:!0,type:"text"}],grades:["primary","middle","high"],subjects:["数学","语文","英语","物理","化学","生物"],usageCount:0,rating:4.7,author:"清北名师团队"},$e=[Ie,Me,Oe,Ge,Be,Ke],De={id:"deriv-step-by-step",title:"逐步推导",scenario:"derivation",icon:"👣",description:"分步骤详细推导公式/定理",tags:["逐步","详细","严谨"],template:`你是一位擅长公式推导的{{student_grade}}{{subject}}名师。请分步骤详细推导"{{formula}}"。

推导要求：
1. **出发点**：从哪些已知结论出发？
2. **每一步**：
   - 这一步做了什么？
   - 为什么可以这样做？（依据是什么？）
   - 这一步的难点在哪里？
3. **关键步骤标注**：哪一步最关键？为什么？
4. **常见卡点**：学生通常在哪一步卡住？如何讲清楚？
5. **记忆技巧**：如何帮助记忆这个公式而不是死记？

请确保每一步都有"因为...所以..."，逻辑链完整。`,variables:[{key:"formula",label:"公式/定理",placeholder:"如：二次函数顶点式、牛顿第二定律...",required:!0,type:"text"},{key:"student_grade",label:"学生年级",placeholder:"如：初三...",required:!0,type:"text"},{key:"subject",label:"学科",placeholder:"如：数学...",required:!0,type:"text"}],grades:["middle","high"],subjects:["数学","物理","化学"],usageCount:0,rating:4.8,author:"清北名师团队"},Qe={id:"deriv-intuitive",title:"直观理解",scenario:"derivation",icon:"💡",description:"用直觉和实例帮助理解公式含义",tags:["直观","直觉","理解"],template:`你是一位擅长直观教学的名师。请用直觉和实例帮助{{student_grade}}学生理解"{{formula}}"。

理解框架：
1. **直觉解释**：不证自明地"感觉"这个公式为什么是对的
2. **具体实例**：用 2-3 个具体数字代入，看规律
3. **类比联想**：这个公式和生活中的什么现象类似？
4. **极限检验**：当某个变量趋于 0 或无穷大时，公式还合理吗？
5. **量纲分析**：从单位/量纲角度验证公式的合理性
6. **一句话总结**：用最简洁的语言说出这个公式的"灵魂"

请避免直接给出证明，先用直觉"说服"学生。`,variables:[{key:"formula",label:"公式/定理",placeholder:"如：欧姆定律、三角形面积公式...",required:!0,type:"text"},{key:"student_grade",label:"学生年级",placeholder:"如：初二...",required:!0,type:"text"}],grades:["middle","high"],subjects:["数学","物理","化学"],usageCount:0,rating:4.7,author:"清北名师团队"},Ve={id:"deriv-historical",title:"历史背景",scenario:"derivation",icon:"📜",description:"从数学史/科学史角度讲解公式发现过程",tags:["历史","背景","人文"],template:`你是一位精通科学史的名师。请讲述"{{formula}}"背后的发现故事。

目标学生：{{student_grade}}

故事结构：
1. **时代背景**：当时科学界面临什么问题？
2. **发现者**：是谁发现的？他/她有什么特点？
3. **发现过程**：
   - 是什么现象引起了注意？
   - 经历了哪些失败/曲折？
   - 那个"尤里卡"时刻是什么样的？
4. **当时争议**：这个发现一开始被接受了吗？
5. **现代意义**：今天这个公式在哪里被使用？
6. **给学生的启示**：从发现过程中能学到什么科学精神？

请确保故事真实、生动，激发学生对科学的兴趣。`,variables:[{key:"formula",label:"公式/定理",placeholder:"如：勾股定理、万有引力定律...",required:!0,type:"text"},{key:"student_grade",label:"学生年级",placeholder:"如：初二...",required:!0,type:"text"}],grades:["middle","high"],subjects:["数学","物理","化学"],usageCount:0,rating:4.6,author:"清北名师团队"},ze={id:"deriv-visual",title:"图形证明",scenario:"derivation",icon:"📐",description:"用图形/动画思路可视化证明公式",tags:["图形","可视化","直觉"],template:`你是一位擅长可视化教学的名师。请用图形/动画思路可视化证明"{{formula}}"。

目标学生：{{student_grade}}

可视化设计：
1. **图形描述**：详细描述一个能"看出"结论的图形
2. **动画分解**：把这个图形的变换过程分步骤描述（像动画一样）
3. **面积/长度对应**：图形中的哪部分对应公式中的哪一项？
4. **Mermaid 图表**：用 Mermaid 语法绘制可视化图
5. **动手验证**：学生可以用剪纸/画图来验证

请确保图形简洁、证明直观，学生"一看就懂"。`,variables:[{key:"formula",label:"公式/定理",placeholder:"如：完全平方公式、勾股定理...",required:!0,type:"text"},{key:"student_grade",label:"学生年级",placeholder:"如：初二...",required:!0,type:"text"}],grades:["middle","high"],subjects:["数学","物理"],usageCount:0,rating:4.7,author:"清北名师团队"},We={id:"deriv-real-world",title:"实际应用",scenario:"derivation",icon:"🌍",description:"展示公式在生活中的实际应用",tags:["应用","生活","价值"],template:`你是一位擅长联系实际的名师。请展示"{{formula}}"在现实生活中的实际应用。

目标学生：{{student_grade}}

应用展示：
1. **日常生活**：这个公式在日常生活中哪里用得到？（至少 3 个场景）
2. **工程科技**：在哪些科技领域这个公式是基础？
3. **自然现象**：自然界中哪些现象可以用这个公式解释？
4. **动手实验**：设计一个简单的家庭实验来验证这个公式
5. **职业连接**：哪些职业需要用到这个公式？
6. **思考题**：如果这个公式"不存在"，世界会变成什么样？

请确保例子真实、有趣，让学生感到"学了有用"。`,variables:[{key:"formula",label:"公式/定理",placeholder:"如：杠杆原理、能量守恒...",required:!0,type:"text"},{key:"student_grade",label:"学生年级",placeholder:"如：初二...",required:!0,type:"text"}],grades:["middle","high"],subjects:["数学","物理","化学"],usageCount:0,rating:4.6,author:"清北名师团队"},Ue={id:"deriv-extension",title:"拓展延伸",scenario:"derivation",icon:"🚀",description:"从基础公式拓展到更一般形式",tags:["拓展","延伸","高阶"],template:`你是一位擅长拓展教学的名师。请从"{{formula}}"出发，拓展到更一般的形式。

目标学生：{{student_grade}}

拓展设计：
1. **当前形式**：清晰表述目前的公式
2. **特殊→一般**：这个公式是更一般结论的什么特殊情况？
3. **推广方向**：可以从哪些角度推广？
   - 维度变化（2D→3D）
   - 条件放宽（特殊→一般）
   - 类比迁移（A领域→B领域）
4. **拓展后的形式**：用简洁语言描述推广后的结论
5. **何时用拓展形式**：什么情况下需要用到更一般的形式？
6. **思考问题**：给学生留下一个值得思考的拓展问题

请确保拓展自然、不过度超纲，激发求知欲。`,variables:[{key:"formula",label:"基础公式/定理",placeholder:"如：一元二次方程求根公式...",required:!0,type:"text"},{key:"student_grade",label:"学生年级",placeholder:"如：高一...",required:!0,type:"text"}],grades:["high"],subjects:["数学","物理","化学"],usageCount:0,rating:4.8,author:"清北名师团队"},Xe=[De,Qe,Ve,ze,We,Ue],He={id:"explore-cross-discipline",title:"跨学科融合",scenario:"explore",icon:"🔗",description:"展示知识点与其他学科的联系",tags:["跨学科","融合","视野"],template:`你是一位擅长跨学科教学的名师。请展示"{{knowledge_point}}"与其他学科的关联。

目标学生：{{student_grade}}

关联设计：
1. **与数学的关联**（如果是理科知识点）：需要哪些数学工具？
2. **与语文的关联**：相关的诗词、文章、典故
3. **与历史的关联**：这个知识点的发现/发明对历史的影响
4. **与艺术的关联**：音乐、美术中是否有相关的表现？
5. **与体育的关联**：运动中的科学原理
6. **综合项目**：设计一个融合多个学科的小项目

请用思维导图的形式展示这些联系（用 Mermaid 语法）。`,variables:[{key:"knowledge_point",label:"知识点",placeholder:"如：对称、声波、水循环...",required:!0,type:"text"},{key:"student_grade",label:"学生年级",placeholder:"如：初一...",required:!0,type:"text"}],grades:["middle","high"],subjects:["数学","语文","英语","物理","化学","生物"],usageCount:0,rating:4.7,author:"清北名师团队"},Je={id:"explore-frontier",title:"前沿科学",scenario:"explore",icon:"🔬",description:"介绍知识点在前沿科学中的应用",tags:["前沿","科学","激发"],template:`你是一位关注前沿科学的名师。请介绍"{{knowledge_point}}"在前沿科学中的应用。

目标学生：{{student_grade}}

前沿展示：
1. **基础知识回顾**：简洁复习这个知识点的核心
2. **前沿领域**：这个知识在哪些前沿领域有应用？
   - 人工智能
   - 量子计算
   - 生物技术
   - 航天工程
   - 新能源
3. **具体案例**：一个真实的前沿科技案例
4. **科学家故事**：这个领域的一位代表性科学家
5. **未来展望**：10-20 年后，这个领域会发展到哪里？
6. **给学生的建议**：如果感兴趣，现在可以做哪些准备？

请用通俗的语言解释前沿概念，不堆砌术语。`,variables:[{key:"knowledge_point",label:"知识点",placeholder:"如：概率、电磁感应、细胞分裂...",required:!0,type:"text"},{key:"student_grade",label:"学生年级",placeholder:"如：高一...",required:!0,type:"text"}],grades:["middle","high"],subjects:["数学","物理","化学","生物"],usageCount:0,rating:4.9,author:"清北名师团队"},Ye={id:"explore-history-science",title:"科学史话",scenario:"explore",icon:"📖",description:"讲述知识发现背后的科学史故事",tags:["科学史","故事","人文"],template:`你是一位精通科学史的名师。请讲述"{{knowledge_point}}"发现过程中的精彩故事。

目标学生：{{student_grade}}

故事结构：
1. **时代背景**：当时人们的认知是什么？
2. **关键人物**：谁做出了关键贡献？他/她的生平趣事
3. **发现过程**：
   - 偶然发现还是刻意探索？
   - 遇到了哪些困难？
   - 有哪些有趣的"插曲"？
4. **当时争议**：这个发现一开始被接受了吗？
5. **对今天的影响**：改变了什么？
6. **思考讨论**：从故事中学到了什么科学精神？

请确保故事有据可查、生动有趣。`,variables:[{key:"knowledge_point",label:"知识点",placeholder:"如：DNA 结构、电磁感应...",required:!0,type:"text"},{key:"student_grade",label:"学生年级",placeholder:"如：高一...",required:!0,type:"text"}],grades:["middle","high"],subjects:["物理","化学","生物"],usageCount:0,rating:4.6,author:"清北名师团队"},Ze={id:"explore-hands-on",title:"动手实践",scenario:"explore",icon:"🛠️",description:"设计可动手操作的探究项目",tags:["实践","动手","项目"],template:`你是一位擅长项目式学习的名师。请围绕"{{knowledge_point}}"设计一个可动手操作的探究项目。

目标学生：{{student_grade}}

项目设计：
1. **项目名称**：一个吸引人的名字
2. **项目目标**：做完之后能学到什么？
3. **材料清单**：家中或超市容易找到的材料（不超过 10 种）
4. **制作步骤**：分步骤详细说明（配尺寸/用量）
5. **原理解释**：用学生的语言解释背后的原理
6. **拓展方向**：如果感兴趣，可以怎么改进？
7. **安全提醒**：需要注意的安全事项

请确保项目安全、可操作、有教育价值。`,variables:[{key:"knowledge_point",label:"知识点",placeholder:"如：大气压强、杠杆原理...",required:!0,type:"text"},{key:"student_grade",label:"学生年级",placeholder:"如：初二...",required:!0,type:"text"}],grades:["primary","middle","high"],subjects:["数学","物理","化学","生物"],usageCount:0,rating:4.8,author:"清北名师团队"},et={id:"explore-debate",title:"辩论话题",scenario:"explore",icon:"🎭",description:"围绕知识点设计辩论/讨论话题",tags:["辩论","批判思维","表达"],template:`你是一位擅长思辨教学的名师。请围绕"{{knowledge_point}}"设计一个辩论/讨论话题。

目标学生：{{student_grade}}

辩论设计：
1. **辩题**：一个有争议性、可辩论的命题
2. **正方观点**：支持方的论据（至少 3 条）
3. **反方观点**：反对方的论据（至少 3 条）
4. **关键概念**：辩论中需要厘清的概念
5. **评判标准**：如何判定哪方更有道理？
6. **讨论延伸**：如果无法达成共识，还有什么角度？
7. **家长引导**：如何引导讨论而不直接给答案？

请确保辩题有教育价值，能锻炼批判思维。`,variables:[{key:"knowledge_point",label:"知识点",placeholder:"如：转基因、人工智能、克隆...",required:!0,type:"text"},{key:"student_grade",label:"学生年级",placeholder:"如：高一...",required:!0,type:"text"}],grades:["middle","high"],subjects:["物理","化学","生物"],usageCount:0,rating:4.5,author:"清北名师团队"},tt={id:"explore-career",title:"职业连接",scenario:"explore",icon:"💼",description:"展示知识点与未来职业的联系",tags:["职业","未来","激励"],template:`你是一位职业规划辅导名师。请展示"{{knowledge_point}}"与未来职业的联系。

目标学生：{{student_grade}}

职业展示：
1. **直接相关的职业**：哪些职业直接使用这个知识点？
2. **职业介绍**：每个职业的日常工作、所需技能、发展前景
3. **代表人物**：这个领域的一位杰出人物（及其故事）
4. **学习路径**：如果想从事这个职业，现在需要学好什么？
5. **薪资与前景**：客观的职业信息（不过度美化）
6. **给学生的建议**：现在可以做哪些准备？

请确保信息客观准确，不夸大也不贬低任何职业。`,variables:[{key:"knowledge_point",label:"知识点",placeholder:"如：编程、力学、细胞...",required:!0,type:"text"},{key:"student_grade",label:"学生年级",placeholder:"如：高一...",required:!0,type:"text"}],grades:["middle","high"],subjects:["数学","物理","化学","生物"],usageCount:0,rating:4.6,author:"清北名师团队"},rt=[He,Je,Ye,Ze,et,tt],nt={id:"interact-game",title:"游戏化学习",scenario:"interaction",icon:"🎲",description:"设计一个亲子学习游戏",tags:["游戏","趣味","互动"],template:`你是一位擅长游戏化教学的名师。请围绕"{{knowledge_point}}"设计一个亲子学习游戏。

目标学生：{{student_grade}}

游戏设计：
1. **游戏名称**：一个吸引人的名字
2. **游戏目标**：通过游戏掌握什么知识/技能？
3. **游戏材料**：需要什么道具？（尽量用家庭常见物品）
4. **游戏规则**：清晰、简洁的规则说明
5. **玩法规则**：具体怎么玩？分步骤说明
6. **难度调整**：如何根据孩子水平调整难度？
7. **获胜条件**：怎么算赢？有没有奖励机制？
8. **教育原理**：这个游戏为什么能帮孩子学习？

请确保游戏安全、有趣、真正有教育价值（不是披着游戏皮的刷题）。`,variables:[{key:"knowledge_point",label:"知识点",placeholder:"如：乘法口诀、几何图形...",required:!0,type:"text"},{key:"student_grade",label:"学生年级",placeholder:"如：小学二年级...",required:!0,type:"text"}],grades:["primary","middle","high"],subjects:["数学","语文","英语","物理","化学","生物"],usageCount:0,rating:4.9,author:"清北名师团队"},at={id:"interact-dialogue",title:"对话脚本",scenario:"interaction",icon:"💬",description:"编写家长与孩子的辅导对话脚本",tags:["对话","脚本","实操"],template:`你是一位擅长亲子沟通的名师。请编写一份家长辅导"{{knowledge_point}}"的对话脚本。

目标学生：{{student_grade}}

对话脚本：
1. **开场**：如何自然地引入学习话题（不说"来学习"）
2. **引导对话**：
   - 家长说什么（用提问代替讲解）
   - 孩子可能的回答
   - 针对不同回答的应对策略
3. **关键转折点**：当孩子卡住时，家长说什么？
4. **总结收尾**：如何自然地结束，让孩子有成就感
5. **家长注意事项**：
   - 避免说的话（"这么简单都不会"）
   - 推荐说的话（"你的思路很有意思"）
6. **备选方案**：如果孩子不配合怎么办？

请确保对话自然、可操作，家长"照搬"就能用。`,variables:[{key:"knowledge_point",label:"知识点",placeholder:"如：分数除法、时态...",required:!0,type:"text"},{key:"student_grade",label:"学生年级",placeholder:"如：小学五年级...",required:!0,type:"text"}],grades:["primary","middle","high"],subjects:["数学","语文","英语","物理","化学","生物"],usageCount:0,rating:4.8,author:"清北名师团队"},st={id:"interact-experiment",title:"家庭实验",scenario:"interaction",icon:"🧪",description:"用家庭材料设计简易实验",tags:["实验","材料易得","安全"],template:`你是一位擅长家庭实验的名师。请利用家庭常见材料设计一个展示"{{knowledge_point}}"的实验。

目标学生：{{student_grade}}

实验设计：
1. **实验名称**：一个吸引人的名字
2. **实验原理**：用简单的语言解释
3. **材料清单**：超市/厨房/文具店能买到的材料（附替代品）
4. **安全提醒**：特别注意的安全事项
5. **实验步骤**：分步骤详细说明（配预估时间）
6. **观察重点**：需要仔细观察什么？
7. **原理揭秘**：实验后如何给孩子解释原理？
8. **拓展问题**：实验后可以问孩子的 3 个思考题

请确保实验绝对安全、材料易得、现象明显。`,variables:[{key:"knowledge_point",label:"知识点",placeholder:"如：酸碱指示剂、大气压...",required:!0,type:"text"},{key:"student_grade",label:"学生年级",placeholder:"如：初一...",required:!0,type:"text"}],grades:["primary","middle","high"],subjects:["物理","化学","生物"],usageCount:0,rating:4.8,author:"清北名师团队"},lt={id:"interact-story",title:"故事共创",scenario:"interaction",icon:"📝",description:"家长和孩子一起创作教学故事",tags:["共创","想象","表达"],template:`你是一位擅长创意写作的名师。请提供一个"故事共创"方案，让家长和孩子一起创作一个包含"{{knowledge_point}}"的教学故事。

目标学生：{{student_grade}}

共创方案：
1. **故事开头**：提供一个吸引人的开头
2. **角色设定**：2-3 个有趣的配角
3. **情节框架**：故事的大致走向（但留出创作空间）
4. **知识融入点**：在故事的哪个环节自然引入知识点
5. **互动问题**：写作过程中家长可以问孩子的问题
6. **结局选择**：提供 2-3 种不同风格的结局方向
7. **展示方式**：故事完成后可以怎么"展示"？

请提供开头和框架，但留出足够空间让孩子发挥创意。`,variables:[{key:"knowledge_point",label:"知识点",placeholder:"如：分数、植物生长...",required:!0,type:"text"},{key:"student_grade",label:"学生年级",placeholder:"如：小学三年级...",required:!0,type:"text"}],grades:["primary","middle"],subjects:["数学","语文","英语","科学"],usageCount:0,rating:4.7,author:"清北名师团队"},it={id:"interact-quiz",title:"知识问答赛",scenario:"interaction",icon:"⚔️",description:"设计亲子知识抢答游戏",tags:["竞赛","抢答","趣味"],template:`你是一位擅长游戏教学的名师。请设计一套亲子知识抢答游戏，围绕"{{knowledge_point}}"。

目标学生：{{student_grade}}

游戏设计：
1. **准备阶段**：
   - 家长需要做什么准备？
   - 需要制作什么道具？
2. **游戏规则**：抢答规则、计分规则
3. **题目设计**（10 道）：
   - 必答题 3 道（基础）
   - 抢答题 4 道（中等）
   - 风险题 3 道（挑战，可选择是否作答）
4. **奖惩机制**：赢了的奖励、输了的小惩罚（趣味性）
5. **加时赛**：平局怎么办？
6. **变体玩法**：可以怎么改变规则增加趣味？

请确保规则公平、难度适中、氛围轻松。`,variables:[{key:"knowledge_point",label:"知识点",placeholder:"如：古诗词、几何...",required:!0,type:"text"},{key:"student_grade",label:"学生年级",placeholder:"如：小学五年级...",required:!0,type:"text"}],grades:["primary","middle","high"],subjects:["数学","语文","英语","物理","化学","生物"],usageCount:0,rating:4.7,author:"清北名师团队"},ot={id:"interact-real-life",title:"生活任务",scenario:"interaction",icon:"🏠",description:"设计将知识应用到生活中的亲子任务",tags:["生活","任务","实用"],template:`你是一位擅长生活教育的名师。请设计一个亲子任务，让孩子在生活中应用"{{knowledge_point}}"。

目标学生：{{student_grade}}

任务设计：
1. **任务名称**：一个有趣的任务名
2. **任务背景**：为什么要做这个任务？
3. **任务目标**：完成之后能学到什么？
4. **任务步骤**：
   - 准备（5 分钟）
   - 执行（15-30 分钟）
   - 记录（拍照/笔记）
   - 总结（讨论）
5. **所需材料**：家庭常见物品
6. **家长角色**：在任务中家长应该做什么？
7. **反思问题**：任务后一起讨论的问题
8. **成果展示**：任务成果可以怎么展示/保存？

请确保任务安全、可操作、让孩子感到"学了真有用"。`,variables:[{key:"knowledge_point",label:"知识点",placeholder:"如：统计、测量、分类...",required:!0,type:"text"},{key:"student_grade",label:"学生年级",placeholder:"如：小学四年级...",required:!0,type:"text"}],grades:["primary","middle","high"],subjects:["数学","语文","英语","物理","化学","生物"],usageCount:0,rating:4.6,author:"清北名师团队"},dt={id:"interaction-primary-level",title:"小学亲子互动（游戏化版）",scenario:"interaction",icon:"🎮",description:"亲子角色卡、手工制作、户外寻宝、数学游戏，让孩子在玩中学",tags:["游戏化","亲子角色","动手操作","小学"],gradeLevel:"primary",template:`你是一位资深小学教师，擅长设计亲子互动游戏，让孩子在玩耍中掌握知识。

请为小学生（{{student_grade}}）和家长围绕"{{knowledge_point}}"设计一个亲子互动活动。

活动设计要求：
1. **活动形式**：选择以下之一——亲子角色卡、手工制作、户外寻宝、数学游戏（扑克牌/骰子/拼图），说明选择理由
2. **活动时长**：5-10 分钟，明确标注各环节时间分配
3. **准备材料**：列出所有材料，必须简单易得（家中或文具店随时可买）
4. **规则说明**：用编号列出 3-5 条清晰规则，确保孩子能听懂
5. **角色分工**：明确家长做什么、孩子做什么、哪里需要合作
6. **胜负或完成标准**：设定明确的达成目标（闯过几关/完成几轮/拼出什么图案）
7. **知识嵌入**：说明在哪个环节、以什么方式让孩子接触"{{knowledge_point}}"
8. **安全提示**：提醒需要注意的安全事项（如有）

语言要求：
- 使用"我们""一起""让我们"等亲切称呼
- 多用短句，活泼有趣
- 适当用 emoji 增加趣味性

请让家长和孩子都觉得好玩、有收获，而不是变相刷题。`,variables:[{key:"knowledge_point",label:"知识点",placeholder:"如：乘法口诀、图形对称、水的浮力",required:!0,type:"text"},{key:"student_grade",label:"学生年级",placeholder:"如：小学二年级",required:!0,type:"text"}],grades:["primary"],subjects:["数学","语文","英语","科学","道德与法治"],usageCount:0,rating:5,author:"teacher-team"},ct={id:"interaction-middle-level",title:"初中亲子互动（实验探究版）",scenario:"interaction",icon:"🧪",description:"家庭迷你实验+实验记录表+引导式提问，培养科学探究能力",tags:["实验探究","亲子协作","科学方法","初中"],gradeLevel:"middle",template:`你是一位资深初中教师，擅长设计家庭迷你实验，让学生在动手探究中理解知识本质。

请为初中生（{{student_grade}}）和家长围绕"{{knowledge_point}}"设计一个亲子实验探究活动。

实验设计框架：
1. **实验名称**：一个有趣的名称，激发探索兴趣
2. **实验目的**：通过本实验要验证或探究什么？用一句话说明
3. **材料清单**：列出全部材料，要求安全、家庭易得（避免危险化学品），标注替代方案
4. **安全提示**：明确列出注意事项（如热水、玻璃器皿、电器等）
5. **实验步骤**：分 4-6 步，每步用一句话说清"做什么"和"观察什么"，家长和孩子分工标注
6. **引导式提问**：在关键节点设计 3-4 个问题，引导孩子预测→观察→思考（不要直接给答案）
7. **实验记录表**：设计一个简单的记录表格（项目/预测/实际/差距）
8. **原理揭示**：实验结束后，用 2-3 句话揭示背后的{{knowledge_point}}原理
9. **联系课堂**：说明这个实验对应课本哪个章节、和课堂知识的关联
10. **拓展追问**：留 1 个开放问题，鼓励回家后继续探究

语言要求：
- 严谨但不失亲切
- 鼓励动手和观察，不要直接灌输结论
- 用"猜猜看""你发现了什么"等引导语

请确保实验可在普通家庭环境中安全完成，现象明显、原理清晰。`,variables:[{key:"knowledge_point",label:"知识点",placeholder:"如：浮力产生原因、酸碱中和、光合作用",required:!0,type:"text"},{key:"student_grade",label:"学生年级",placeholder:"如：初二",required:!0,type:"text"}],grades:["middle"],subjects:["数学","语文","英语","物理","化学","生物"],usageCount:0,rating:5,author:"teacher-team"},ut={id:"interaction-high-level",title:"高中亲子互动（研究性课题版）",scenario:"interaction",icon:"🔬",description:"小型调研报告、辩论赛、社会调查、科技前沿讨论，培养研究性思维",tags:["研究性课题","学术规范","思辨","高中"],gradeLevel:"high",template:`你是一位资深高中教师，擅长指导学生开展研究性学习，培养学术规范和深度思考能力。

请为高中生（{{student_grade}}）和家长围绕"{{knowledge_point}}"设计一个亲子研究性课题活动。

课题设计框架：
1. **课题背景**：用 2-3 句话说明这个课题的现实意义或学术价值（从新闻/生活现象引入）
2. **研究问题**：提出 1 个核心研究问题（具体、可探究、非简单是非题）
3. **研究形式**：选择以下之一——小型调研报告、家庭辩论会、社会调查实践、科技前沿文献共读讨论
4. **分工方案**：明确家长承担什么角色（资料协助/讨论对手/资源支持）、学生承担什么（提出问题/分析/撰写/展示）
5. **实施步骤**：分 3-4 阶段（准备→探究→总结→成果），每阶段标注预计耗时（总计 1-2 周内完成）
6. **资料建议**：推荐 2-3 类参考资料（纪录片/科普文章/数据库/专家访谈方向）
7. **成果形式**：明确最终产出——调研报告（含提纲要求）、辩论稿、调查数据表或 PPT 展示大纲
8. **评价维度**：给出 3-4 个评价标准（如问题是否聚焦、论据是否可靠、结论是否有深度）
9. **学术规范**：提醒引用来源、区分事实与观点、避免抄袭的基本要求

语言要求：
- 正式严谨，但保持对话感
- 用"你认为""你怎么看"鼓励独立思考
- 家长是协作伙伴而非答案提供者，避免家长主导结论

请让课题接近真实学术研究流程，但难度适合高中生的认知水平。`,variables:[{key:"knowledge_point",label:"知识点",placeholder:"如：量子计算基础、碳排放经济、基因编辑伦理",required:!0,type:"text"},{key:"student_grade",label:"学生年级",placeholder:"如：高二",required:!0,type:"text"}],grades:["high"],subjects:["数学","物理","化学","生物","思想政治","历史","地理"],usageCount:0,rating:5,author:"teacher-team"},pt=[nt,at,st,lt,it,ot,dt,ct,ut],O=[...ue,..._e,...Ce,...Re,...$e,...Xe,...rt,...pt];function gt(t){return O.filter(r=>!(t.grade&&!r.grades.includes(t.grade)||t.subject&&!r.subjects.includes(t.subject)||t.scenario&&r.scenario!==t.scenario))}const mt=["数学","语文","英语","物理","化学","生物","历史","地理"],ht=[{value:"explain",label:"知识讲解"},{value:"generate",label:"出题组卷"},{value:"assess",label:"测评批改"},{value:"plan",label:"学习计划"},{value:"error-analysis",label:"错题分析"},{value:"derivation",label:"公式推导"},{value:"explore",label:"拓展探究"},{value:"interaction",label:"亲子互动"}],xt=({grade:t,subject:r,scenario:n,searchQuery:a,resultCount:l,onGradeChange:s,onSubjectChange:i,onScenarioChange:p,onSearchChange:u})=>e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"flex flex-wrap gap-3",children:[e.jsxs("select",{value:t,onChange:o=>s(o.target.value),className:"px-3 py-1.5 border border-gray-300 rounded-lg text-sm",children:[e.jsx("option",{value:"",children:"全部年级"}),e.jsx("option",{value:"primary",children:"小学"}),e.jsx("option",{value:"middle",children:"初中"}),e.jsx("option",{value:"high",children:"高中"})]}),e.jsxs("select",{value:r,onChange:o=>i(o.target.value),className:"px-3 py-1.5 border border-gray-300 rounded-lg text-sm",children:[e.jsx("option",{value:"",children:"全部学科"}),mt.map(o=>e.jsx("option",{value:o,children:o},o))]}),e.jsxs("select",{value:n,onChange:o=>p(o.target.value),className:"px-3 py-1.5 border border-gray-300 rounded-lg text-sm",children:[e.jsx("option",{value:"",children:"全部场景"}),ht.map(o=>e.jsx("option",{value:o.value,children:o.label},o.value))]}),e.jsx("input",{type:"text",placeholder:"🔍 搜索提示词...",value:a,onChange:o=>u(o.target.value),className:"flex-1 min-w-[160px] px-3 py-1.5 border border-gray-300 rounded-lg text-sm"})]}),e.jsxs("p",{className:"text-xs text-gray-400",children:["共 ",l," 个模板"]})]}),bt=({template:t,onClick:r})=>e.jsxs("button",{onClick:()=>r(t),className:"text-left bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group w-full",children:[e.jsxs("div",{className:"flex items-start justify-between mb-2",children:[e.jsx("span",{className:"text-2xl",children:t.icon}),e.jsxs("span",{className:"text-xs text-gray-400",children:["⭐ ",t.rating]})]}),e.jsx("h4",{className:"text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-1",children:t.title}),e.jsx("p",{className:"text-xs text-gray-500 line-clamp-2",children:t.description}),e.jsx("div",{className:"mt-2 flex flex-wrap gap-1",children:t.tags.slice(0,3).map(n=>e.jsx("span",{className:"text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded",children:n},n))})]}),yt=({templates:t,onSelect:r})=>t.length===0?e.jsx("div",{className:"text-center py-12 text-gray-400",children:e.jsx("p",{children:"没有找到匹配的提示词模板"})}):e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",children:t.map(n=>e.jsx(bt,{template:n,onClick:r},n.id))}),jt=({variable:t,value:r,onChange:n})=>{const a="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none";return e.jsxs("div",{className:"mb-4",children:[e.jsxs("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:[t.label,t.required&&e.jsx("span",{className:"text-red-500 ml-1",children:"*"})]}),t.type==="textarea"?e.jsx("textarea",{className:`${a} h-24 resize-none`,placeholder:t.placeholder,value:r,onChange:l=>n(t.key,l.target.value)}):t.type==="select"?e.jsxs("select",{className:a,value:r,onChange:l=>n(t.key,l.target.value),children:[e.jsx("option",{value:"",children:"请选择..."}),t.options?.map(l=>e.jsx("option",{value:l,children:l},l))]}):e.jsx("input",{type:"text",className:a,placeholder:t.placeholder,value:r,onChange:l=>n(t.key,l.target.value)})]})},kt=({template:t,prefilledVars:r,onSend:n,onCopy:a,onBack:l,copied:s})=>{const[i,p]=d.useState(()=>{const c={};return t.variables.forEach(x=>{c[x.key]=r?.[x.key]||x.defaultValue||""}),c}),u=t.variables.filter(c=>c.required).every(c=>i[c.key]?.trim()),o=(c,x)=>{p(y=>({...y,[c]:x}))};return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("button",{onClick:l,className:"text-gray-400 hover:text-gray-600",children:"← 返回"}),e.jsx("span",{className:"text-xl",children:t.icon}),e.jsx("h3",{className:"text-lg font-bold",children:t.title})]}),e.jsx("p",{className:"text-sm text-gray-500",children:t.description}),e.jsx("div",{className:"border-t pt-4",children:t.variables.map(c=>e.jsx(jt,{variable:c,value:i[c.key],onChange:o},c.key))}),e.jsxs("div",{className:"flex gap-3 pt-2",children:[e.jsx("button",{onClick:()=>n(i),disabled:!u,className:"px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors",children:"🚀 发送 AI"}),e.jsx("button",{onClick:a,className:`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${s?"bg-green-100 text-green-700 border border-green-200":"border border-gray-300 hover:bg-gray-50"}`,children:s?"✅ 已复制!":"📋 复制 Prompt"})]})]})},_t=({content:t,isStreaming:r,onRegenerate:n,onCopy:a,onEditParams:l,onBack:s})=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("button",{onClick:s,className:"text-gray-400 hover:text-gray-600 text-sm",children:"← 返回"}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx("button",{onClick:n,className:"px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50",children:"🔄 重新生成"}),e.jsx("button",{onClick:a,className:"px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50",children:"📋 复制结果"})]})]}),e.jsxs("div",{className:"prose prose-sm max-w-none bg-gray-50 rounded-xl p-6 min-h-[200px]",children:[e.jsx(v,{children:t}),r&&e.jsx("span",{className:"inline-block w-2 h-4 bg-blue-500 animate-pulse ml-0.5"})]}),!r&&t&&e.jsx("div",{className:"flex justify-center",children:e.jsx("button",{onClick:l,className:"px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg",children:"✏️ 修改参数重新生成"})})]}),vt=({isOpen:t,onClose:r,knowledgePointTitle:n,knowledgePointGrade:a})=>{const[l,s]=d.useState("browse"),[i,p]=d.useState(null),[u,o]=d.useState(""),[c,x]=d.useState(""),[y,G]=d.useState(""),[k,B]=d.useState(""),[N,f]=d.useState(""),[K,P]=d.useState(!1),[w,$]=d.useState({}),[C,j]=d.useState(!1),h=d.useRef(null),S=d.useMemo(()=>{let g=u||c||y?gt({grade:u||void 0,subject:c||void 0,scenario:y||void 0}):O;if(k){const m=k.toLowerCase();g=g.filter(b=>b.title.toLowerCase().includes(m)||b.description.toLowerCase().includes(m)||b.tags.some(z=>z.toLowerCase().includes(m)))}return g},[u,c,y,k]),D=d.useCallback(g=>{p(g),j(!1),s("detail")},[]),F=d.useCallback(async g=>{if(i){$(g),s("result"),f(""),P(!0);try{await ee(i,g,m=>{f(b=>b+m)})}catch(m){f(`⚠️ 生成失败：${m instanceof Error?m.message:"未知错误"}`)}finally{P(!1)}}},[i]),Q=d.useCallback(()=>{if(!i)return;let g=i.template;for(const[m,b]of Object.entries(w))g=g.replace(new RegExp(`\\{\\{${m}\\}\\}`,"g"),b);navigator.clipboard.writeText(g).then(()=>{j(!0),h.current&&clearTimeout(h.current),h.current=setTimeout(()=>j(!1),4e3)}).catch(()=>{const m=document.createElement("textarea");m.value=g,document.body.appendChild(m),m.select(),document.execCommand("copy"),document.body.removeChild(m),j(!0),h.current&&clearTimeout(h.current),h.current=setTimeout(()=>j(!1),4e3)})},[i,w]);d.useEffect(()=>()=>{h.current&&clearTimeout(h.current)},[]);const q=d.useCallback(()=>{l==="result"?s("detail"):l==="detail"?s("browse"):r()},[l,r]),V=d.useMemo(()=>{if(n)return{knowledge_point:n,student_grade:a||""}},[n,a]);return t?e.jsx("div",{className:"fixed inset-0 z-[100] flex items-center justify-center bg-black/50",onClick:r,children:e.jsxs("div",{className:"bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col",onClick:g=>g.stopPropagation(),children:[e.jsxs("div",{className:"flex items-center justify-between px-6 py-4 border-b",children:[e.jsx("h2",{className:"text-lg font-bold",children:"📝 教学提示词"}),e.jsx("button",{onClick:r,className:"text-gray-400 hover:text-gray-600 text-xl",children:"✕"})]}),e.jsxs("div",{className:"flex-1 overflow-y-auto p-6",children:[l==="browse"&&e.jsxs("div",{className:"space-y-4",children:[e.jsx(xt,{grade:u,subject:c,scenario:y,searchQuery:k,resultCount:S.length,onGradeChange:o,onSubjectChange:x,onScenarioChange:G,onSearchChange:B}),e.jsx(yt,{templates:S,onSelect:D})]}),l==="detail"&&i&&e.jsxs(e.Fragment,{children:[C&&e.jsx("div",{className:"mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 animate-in fade-in slide-in-from-top-2 duration-300",children:e.jsxs("div",{className:"flex items-start gap-2",children:[e.jsx("span",{className:"text-lg leading-none",children:"✅"}),e.jsxs("div",{className:"space-y-1",children:[e.jsx("p",{className:"font-medium",children:"已复制到剪贴板！"}),e.jsxs("p",{className:"text-green-600 text-xs leading-relaxed",children:["粘贴到任意 AI 对话窗口（如 ChatGPT、Claude、文心一言等）即可使用。",e.jsx("br",{}),"提示词中的变量已替换为你填写的内容，直接发送即可 🎉"]})]})]})}),e.jsx(kt,{template:i,prefilledVars:V,onSend:F,onCopy:Q,onBack:q,copied:C})]}),l==="result"&&e.jsx(_t,{content:N,isStreaming:K,onRegenerate:()=>F(w),onCopy:()=>navigator.clipboard.writeText(N),onEditParams:q,onBack:q})]})]})}):null},ft=({topic:t,context:r,onPromptModalOpen:n})=>{const[a,l]=d.useState(""),[s,i]=d.useState(!1),p=async()=>{i(!0),l("");try{await Y(t,r,u=>{l(o=>o+u)})}catch(u){console.error(u),alert("生成失败，请检查 API 配置")}finally{i(!1)}};return e.jsxs("div",{className:"pt-8 border-t border-[#F0F1F2]",children:[e.jsxs("div",{className:"flex items-center justify-between mb-6",children:[e.jsxs("h3",{className:"flex items-center text-xl font-bold text-purple-900",children:[e.jsx("span",{className:"mr-2",children:"✨"})," AI 智能助教",e.jsx("span",{className:"ml-3 text-sm font-normal text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full",children:"家长辅导助手"})]}),!a&&!s&&e.jsxs("div",{className:"flex gap-3",children:[e.jsx("button",{onClick:p,className:"px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-purple-200 transition-all flex items-center gap-2",children:e.jsx("span",{children:"生成深度辅导指南"})}),e.jsx("button",{onClick:n,className:"px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-amber-200 transition-all flex items-center gap-2",children:e.jsx("span",{children:"📝 模板模式"})})]})]}),s&&!a&&e.jsx("div",{className:"bg-purple-50 p-8 rounded-2xl border border-purple-100 text-center animate-pulse",children:e.jsx("p",{className:"text-purple-800 font-medium",children:"正在思考中，为您生成专属辅导内容..."})}),(a||s&&a)&&e.jsxs("div",{className:"bg-white border border-purple-100 rounded-2xl p-8 shadow-sm ring-4 ring-purple-50/50",children:[e.jsx("div",{className:"prose prose-purple max-w-none",children:e.jsx(v,{children:a})}),s&&e.jsx("p",{className:"mt-4 text-purple-500 animate-pulse text-sm",children:"正在撰写..."})]})]})},wt=({funFact:t,funStory:r,funQuestion:n,funQuestionAnswer:a})=>!t&&!r&&!n?null:e.jsxs("div",{className:"pt-8 border-t border-[#F0F1F2]",children:[e.jsxs("h3",{className:"flex items-center text-xl font-bold text-amber-900 mb-4",children:[e.jsx("span",{className:"mr-2",children:"🌟"})," 趣味角"]}),e.jsxs("div",{className:"space-y-4",children:[t&&e.jsxs("div",{className:"bg-amber-50 border border-amber-100 rounded-2xl p-5",children:[e.jsxs("h4",{className:"font-bold text-amber-900 mb-2 flex items-center gap-2",children:[e.jsx("span",{children:"🧊"})," 冷知识"]}),e.jsx("p",{className:"text-amber-800 leading-relaxed",children:t})]}),r&&e.jsxs("div",{className:"bg-green-50 border border-green-100 rounded-2xl p-5",children:[e.jsxs("h4",{className:"font-bold text-green-900 mb-2 flex items-center gap-2",children:[e.jsx("span",{children:"📖"})," 生活中的数学"]}),e.jsx("p",{className:"text-green-800 leading-relaxed",children:r})]}),n&&e.jsxs("div",{className:"bg-purple-50 border border-purple-100 rounded-2xl p-5",children:[e.jsxs("h4",{className:"font-bold text-purple-900 mb-2 flex items-center gap-2",children:[e.jsx("span",{children:"❓"})," 互动问答"]}),e.jsx("p",{className:"text-purple-800 mb-3",children:n}),e.jsxs("details",{className:"group",children:[e.jsxs("summary",{className:"cursor-pointer text-sm font-medium text-purple-600 hover:text-purple-800 list-none flex items-center gap-1",children:[e.jsx("span",{className:"group-open:rotate-90 transition-transform",children:"▶"}),"点击揭晓答案"]}),e.jsx("div",{className:"mt-3 p-3 bg-white rounded-xl border border-purple-100",children:e.jsx("p",{className:"text-purple-700",children:a||"暂无答案"})})]})]})]})]}),qt=({point:t,subject:r})=>e.jsxs("div",{className:"p-8 border-b border-[#F0F1F2] bg-gradient-to-r from-blue-50 to-white",children:[e.jsxs("div",{className:"flex items-center gap-4 mb-4",children:[e.jsx("span",{className:"text-4xl",children:r.icon}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("h1",{className:"text-3xl font-bold text-[#1F2329]",children:t.title}),e.jsx("span",{className:"bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-medium",children:r.name})]}),e.jsx("p",{className:"text-[#646A73] mt-2 text-lg",children:t.description})]})]}),t.tags&&e.jsx("div",{className:"flex gap-2 mt-4",children:t.tags.map(n=>e.jsx("span",{className:"px-3 py-1 bg-white border border-blue-100 text-[#3370FF] text-sm rounded-full shadow-sm",children:n},n))})]}),Nt=({questions:t})=>t.length===0?null:e.jsxs("div",{children:[e.jsxs("h3",{className:"flex items-center text-xl font-bold text-green-900 mb-4",children:[e.jsx("span",{className:"mr-2",children:"✏️"})," 实战练习"]}),e.jsx("div",{className:"space-y-4",children:t.map((r,n)=>e.jsxs("div",{className:"bg-white border border-green-100 rounded-xl overflow-hidden shadow-sm",children:[e.jsx("div",{className:"bg-green-50 p-4 border-b border-green-100",children:e.jsxs("p",{className:"font-bold text-green-900",children:["Q",n+1,": ",r.question]})}),e.jsx("div",{className:"p-4 bg-white",children:e.jsxs("p",{className:"text-[#646A73]",children:[e.jsx("span",{className:"font-medium text-[#1F2329] bg-[#F5F6F7] px-2 py-0.5 rounded mr-2",children:"参考答案"}),r.answer]})})]},n))})]}),Pt=({pointId:t,relatedCount:r})=>{const n=W();if(r===0)return null;const a=()=>{n(`/practice?kp=${t}`)};return e.jsx("div",{className:"pt-8 border-t border-[#F0F1F2]",children:e.jsxs("div",{className:"flex items-center justify-between mb-6",children:[e.jsxs("h3",{className:"flex items-center text-xl font-bold text-green-900",children:[e.jsx("span",{className:"mr-2",children:"✏️"})," 巩固练习",e.jsxs("span",{className:"ml-3 text-sm font-normal text-green-600 bg-green-50 px-2 py-0.5 rounded-full",children:[r," 道题"]})]}),e.jsx("button",{onClick:a,className:"px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-green-200 transition-all",children:"开始练习"})]})})},Ct=({content:t})=>e.jsxs("section",{className:"bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden mb-6",children:[e.jsx("div",{className:"px-6 py-4 bg-gradient-to-r from-indigo-50 to-white border-b border-indigo-100",children:e.jsxs("h3",{className:"flex items-center text-lg font-bold text-indigo-800",children:[e.jsx("span",{className:"mr-2",children:"📚"})," 系统教程"]})}),e.jsxs("div",{className:"p-6 space-y-6",children:[e.jsxs("div",{children:[e.jsxs("h4",{className:"font-semibold text-green-700 mb-2 flex items-center",children:[e.jsx("span",{className:"mr-1",children:"🎯"})," 本课目标"]}),e.jsx("ul",{className:"list-disc list-inside space-y-1 ml-2",children:t.objectives.map((r,n)=>e.jsx("li",{className:"text-sm text-gray-700",children:r},n))})]}),e.jsxs("div",{children:[e.jsxs("h4",{className:"font-semibold text-blue-700 mb-2 flex items-center",children:[e.jsx("span",{className:"mr-1",children:"📖"})," 知识讲解"]}),e.jsx("div",{className:"prose prose-sm prose-blue max-w-none text-gray-700",children:e.jsx(v,{children:t.explanation})})]}),t.examples&&t.examples.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{className:"font-semibold text-purple-700 mb-2 flex items-center",children:[e.jsx("span",{className:"mr-1",children:"✏️"})," 例题精讲"]}),e.jsx("div",{className:"space-y-3",children:t.examples.map((r,n)=>e.jsxs("div",{className:"p-3 bg-indigo-50/50 rounded-xl border border-indigo-100",children:[r.title&&e.jsx("p",{className:"font-medium text-sm text-purple-900 mb-1",children:r.title}),e.jsxs("p",{className:"text-sm text-rose-600",children:["题目：",r.problem]}),e.jsxs("p",{className:"text-sm text-emerald-700 mt-1",children:["解答：",r.solution]}),e.jsxs("p",{className:"text-xs text-gray-500 mt-1",children:["💡 ",r.tip]})]},n))})]}),t.interaction&&e.jsxs("div",{children:[e.jsxs("h4",{className:"font-semibold text-amber-700 mb-2 flex items-center",children:[e.jsx("span",{className:"mr-1",children:"🧩"})," 亲子互动"]}),e.jsx("div",{className:"prose prose-sm prose-blue max-w-none text-gray-700",children:e.jsx(v,{children:t.interaction})})]}),t.exercises&&t.exercises.length>0&&e.jsxs("div",{children:[e.jsxs("h4",{className:"font-semibold text-cyan-700 mb-2 flex items-center",children:[e.jsx("span",{className:"mr-1",children:"📝"})," 课后练习"]}),e.jsx("div",{className:"space-y-2",children:t.exercises.map((r,n)=>e.jsxs("details",{className:"group",children:[e.jsxs("summary",{className:"cursor-pointer text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors",children:["第 ",n+1," 题：",r.question]}),e.jsxs("div",{className:"ml-4 mt-1 p-2 bg-emerald-50 rounded-lg",children:[e.jsxs("p",{className:"text-sm text-gray-800",children:["✅ 答案：",r.answer]}),r.explanation&&e.jsxs("p",{className:"text-xs text-gray-600 mt-0.5",children:["解析：",r.explanation]})]})]},n))})]})]})]}),St=t=>{if(!t)return null;for(const r of E)for(const n of r.subjects){const a=n.knowledgePoints.find(l=>l.id===t);if(a)return{point:a,subject:n,grade:r}}return null},Tt=()=>{const{id:t}=U(),[r,n]=d.useState(!1),a=d.useMemo(()=>St(t),[t]),l=d.useMemo(()=>te(t??""),[t]);if(!a)return e.jsx("div",{className:"min-h-screen flex items-center justify-center bg-[#F5F6F7]",children:e.jsxs("div",{className:"text-center",children:[e.jsx("h2",{className:"text-2xl font-bold text-[#1F2329] mb-4",children:"未找到该知识点"}),e.jsx(_,{to:"/",className:"text-[#3370FF] hover:underline font-medium",children:"返回首页"})]})});const{point:s,subject:i,grade:p}=a,u=`年级：${p.name}，学科：${i.name}，知识点：${s.title}，描述：${s.description}`,o=H(s.id);return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"min-h-screen flex flex-col bg-[#F5F6F7] font-sans text-slate-800",children:[e.jsxs("div",{className:"max-w-4xl mx-auto px-4 py-8 flex-grow w-full",children:[e.jsxs(_,{to:"/",className:"mb-6 flex items-center text-[#646A73] hover:text-[#3370FF] transition-colors","aria-label":"返回首页",children:[e.jsx("span",{className:"mr-2",children:"←"})," 返回列表"]}),e.jsxs("nav",{"aria-label":"Breadcrumb",className:"mb-4 text-sm text-[#646A73]",children:[e.jsx(_,{to:"/",className:"hover:text-[#3370FF]",children:"首页"}),e.jsx("span",{className:"mx-2",children:"/"}),e.jsxs("span",{children:[p.name," · ",i.name]})]}),e.jsxs("div",{className:"bg-white rounded-3xl shadow-sm border border-[#F0F1F2] overflow-hidden",children:[e.jsx(qt,{point:s,subject:i}),e.jsxs("div",{className:"p-8 space-y-8",children:[s.tutorialContent&&e.jsx(Ct,{content:s.tutorialContent}),s.practiceQuestions&&s.practiceQuestions.length>0&&e.jsx(Nt,{questions:s.practiceQuestions}),e.jsx(A,{placement:"knowledgeMid"}),o.length>0&&e.jsx(Pt,{pointId:s.id,relatedCount:o.length}),e.jsx(wt,{funFact:s.funFact,funStory:s.funStory,funQuestion:s.funQuestion,funQuestionAnswer:s.funQuestionAnswer}),e.jsx(ft,{topic:s.title,context:u,knowledgePointTitle:s.title,knowledgePointGrade:p.name,onPromptModalOpen:()=>n(!0)}),e.jsx(A,{placement:"knowledgeBottom"}),l.length>0&&e.jsxs("section",{"aria-labelledby":"related-heading",children:[e.jsx("h2",{id:"related-heading",className:"text-lg font-bold text-[#1F2329] mb-3",children:"相关知识点"}),e.jsx("ul",{className:"grid gap-2 sm:grid-cols-2",children:l.map(c=>e.jsx("li",{children:e.jsx(_,{to:`/knowledge/${c.id}`,className:"text-[#3370FF] hover:underline",children:c.title})},c.id))})]})]})]})]}),e.jsx(vt,{isOpen:r,onClose:()=>n(!1),knowledgePointTitle:s.title,knowledgePointGrade:p.name})]}),e.jsx(X,{})]})};export{Tt as KnowledgeDetail};
