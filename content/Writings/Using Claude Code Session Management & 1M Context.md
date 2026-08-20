---
title: "Using Claude Code: Session Management & 1M Context"
type: resource
domain: knowledge
category: ai
status: active
priority: 
review: 
tags:
  - clippings
  - claude
source: https://x.com/trq212/article/2044548257058328723
author:
  - "[[Thariq (@trq212)]]"
published: 2026-04-16
description: "In my recent calls with Claude Code users, one theme keeps coming up: the 1M token context window is a double-edged sword. 在我最近与 Claude Code..."
---

![图像](https://pbs.twimg.com/media/HF-p1RUbEAIH-6t?format=jpg&name=large)

In my recent calls with Claude Code users, one theme keeps coming up: the 1M token context window is a double-edged sword. 在我最近与 Claude Code 用户的通话中，有一个主题不断被提及：100 万令牌上下文窗口是一把双刃剑。

It lets Claude Code operate autonomously for longer and handle tasks more reliably, but it also opens the door to context pollution if you're not deliberate about managing your sessions.它让 Claude Code 能更长时间自主运行，更可靠地处理任务，但如果你不刻意管理会话，也可能导致上下文污染。

Session management matters more than ever and there seem to be a lot of questions about it. Do you keep one session open in a terminal, or two? Start fresh with every prompt? When should you use compact, rewind, or subagents? What causes a bad compact?会话管理比以往任何时候都更重要，似乎有很多相关问题。你是在终端里保持一个会话，还是两个？每个提示都重新开始？什么时候应该使用压缩剂、倒带剂或子剂？是什么导致了糟糕的紧凑盒？

There’s a surprising amount of detail here that can really shape your experience with Claude Code and almost all of it comes from managing your context window.这里有大量细节，能真正影响你使用 Claude Code 的体验，而几乎全部都来自于管理上下文窗口。

## A Quick Primer on Context, Compaction & Context Rot关于情境、压实与情境腐烂的简要入门

![图像](https://pbs.twimg.com/media/HF-nqWCbEAE3Oan?format=jpg&name=large)

The context window is everything the model can "see" at once when generating its next response. It includes your system prompt, the conversation so far, every tool call and its output, and every file that's been read. Claude Code has a context window of one million tokens.上下文窗口是模型生成下一个响应时能同时“看到”的所有内容。它包括你的系统提示、迄今为止的对话、每一次工具调用及其输出，以及所有已读取的文件。Claude Code 的上下文窗口为一百万个令牌。

Unfortunately using context has a slight cost, which is often called context rot. Context rot is the observation that model performance degrades as context grows because attention gets spread across more tokens, and older, irrelevant content starts to distract from the current task. For our 1MM context model, we see some level of context rot happen around ~300-400k tokens, but it is highly dependent on the task- not a fast rule.不幸的是，使用上下文会带来一些代价，这通常被称为上下文腐烂。上下文腐烂是指随着上下文的增长，模型性能下降，因为注意力分散到更多代币上，而过早且无关的内容开始分散当前任务的注意力。对于我们的 1MM 上下文模型，我们看到大约在 30 万到 40 万个代币之间会出现一定程度的上下文腐烂，但这高度依赖任务本身，而不是快速规则。

Context windows are a hard cutoff, so when you’re nearing the end of the context window, you will need to summarize the task you’ve been working on into a smaller description and continue the work in a new context window, we call this compaction. You can also trigger compaction yourself.上下文窗口是一个硬性截止点，所以当你快结束上下文窗口时，你需要把正在做的任务总结成更小的描述，然后在新的上下文窗口中继续工作，我们称之为压缩。你也可以自己触发压实。

![图像](https://pbs.twimg.com/media/HF-ntaxboAAZuCm?format=jpg&name=large)

# Every Turn Is a Branching Point每一回合都是分岔点

Say you've just asked Claude to do something and it's finished, you’ve now got some information in your context (tool calls, tool outputs, your instructions) and you have a surprising number of options for what to do next:假设你刚让 Claude 做某件事，完成后你有了上下文中的一些信息（工具调用、工具输出、指令），并且你有许多令人惊讶的下一步选择：

- **Continue** — send another message in the same session**继续** ——在同一会话中发送另一条消息
- **/rewind (esc esc)** — jump back to a previous message and try again from there**/倒带（ESC Esc）**——跳回之前的消息，然后从那里再试一次
- **/clear** — start a new session, usually with a brief you've distilled from what you just learned**/clear** — 开始新一节，通常会用你刚学到的内容提炼出来的简要内容
- **Compact** — summarize the session so far and keep going on top of the summary**简洁** ——总结到目前为止的会议内容，并继续深入总结
- **Subagents** — delegate the next chunk of work to an agent with its own clean context, and only pull its result back in**子代理** ——将下一段工作委托给拥有自己干净上下文的代理，只将结果拉回

While the most natural is just to continue, the other four options exist to help manage your context.虽然最自然的是继续，但另外四个选项也帮助你管理情境。

![图像](https://pbs.twimg.com/media/HF-n6mMbEAEImhv?format=jpg&name=large)

## When to Start a New Session何时开始新会话

The new 1M context windows means that you can now do longer tasks more reliably, for example to have it build a full-stack app from scratch. But just because your model hasn't run out of context, it doesn't mean you shouldn't start a new session.新的 1M 上下文窗口意味着你可以更可靠地完成更长的任务，比如让它从零开始构建一个全栈应用。但仅仅因为你的模型没有脱离上下文，并不意味着你不应该重新开始一个新会话。

Our general rule of thumb is when you start a new task, you should also start a new session.我们的一般经验法则是，当你开始一个新任务时，也应该同时开始一个新的会话。

A grey area is when you may want to do related tasks where some of the context is still necessary, but not all. 灰色地带是你可能想做一些相关任务，虽然部分上下文仍然必要，但不是全部。

For example, writing the documentation for a feature you just implemented. While you could start a new session, Claude would have to reread the files that you just implemented, which would be slower and more expensive. Since documentation may not be a highly intelligence sensitive task, the extra context is probably worth the efficiency gain of not having to re-read the relevant files again.比如，写你刚实现的功能文档。虽然你可以重新开始新会话，但 Claude 需要重新读取你刚实现的文件，这会更慢且更昂贵。由于文档可能不是高度敏感的情报任务，额外的上下文可能值得不必再次重读相关文件的效率提升。

## Rewinding Instead of Correcting倒带而不是纠正

![图像](https://pbs.twimg.com/media/HF-oDqjbEAI94h5?format=jpg&name=large)

If I had to pick one habit that signals good context management, it’s rewind.如果让我选一个能很好地管理语境的习惯，那就是倒带。

In Claude Code, double-tapping Esc(or running /rewind) lets you jump back to any previous message and re-prompt from there. The messages after that point are dropped from the context.在 Claude Code 中，双击 Esc（或运行/倒带）可以跳回之前的消息，并从那里重新提示。之后的消息会从上下文中被删除。

Rewind is often the better approach to correction. For example, Claude reads five files, tries an approach, and it doesn't work. Your instinct may be to type "that didn't work, try X instead." but the better move is to rewind to just after the file reads, and re-prompt with what you learned. "Don't use approach A, the foo module doesn't expose that — go straight to B."倒带通常是更好的纠正方式。比如，Claude 读取了五个文件，尝试了一种方法，但没有成功。你的本能可能是打“那个没用，试试 X 吧”。 但更好的做法是倒带到文件刚读完，再用你学到的内容重新提示。“别用方法 A，Foo 模块不会暴露那个——直接去 B。”

You can also use “summarize from here” to have Claude summarize its learnings and create a handoff message, kind of like a message to the previous iteration of Claude from its future self that tried something and it didn’t work.你也可以用 “从这里总结 ” 来让 Claude 总结它的学习成果，并创建一个交接消息，有点像未来 Claude 尝试过但没成功时给之前版本的消息。

![图像](https://pbs.twimg.com/media/HF-oKwBbEAAdb6I?format=jpg&name=large)

## Compacting vs. Fresh Sessions

Once a session gets long, you have two ways to shed weight: /compact or /clear (and start fresh). They feel similar but behave very differently.

**Compact** asks the model to summarize the conversation so far, then replaces the history with that summary. It's lossy, you're trusting Claude to decide what mattered, but you didn't have to write anything yourself and Claude might be more thorough in including important learnings or files. You can also steer it by passing instructions (/compact focus on the auth refactor, drop the test debugging).

![图像](https://pbs.twimg.com/media/HF-oPtxaAAAUKMr?format=jpg&name=large)

With /clear you write down what matters ("we're refactoring the auth middleware, the constraint is X, the files that matter are A and B, we've ruled out approach Y") and start clean. It's more work, but the resulting context is what you decided was relevant.

## What Causes a Bad Compact?

![图像](https://pbs.twimg.com/media/HF-oy22bEAE_Jd8?format=jpg&name=large)

If you run a lot of long running sessions, you might have noticed times in which compacting might be particularly bad. In this case we’ve often found that bad compacts can happen when the model can’t predict the direction your work is going.

For example autocompact fires after a long debugging session and summarizes the investigation and your next message is "now fix that other warning we saw in [bar.ts](http://bar.ts/)."

But because the session was focused on debugging, the other warning might have been dropped from the summary.

This is particularly difficult, because due to context rot, the model is at its least intelligent point when compacting. With one million context, you have more time to /compact proactively with a description of what you want to do.

## Subagents & Fresh Context Windows

![图像](https://pbs.twimg.com/media/HF-o6v1bQAA7pS6?format=jpg&name=large)

Subagents are a form of context management, useful for when you know in advance that a chunk of work will produce a lot of intermediate output you won't need again.

When Claude spawns a subagent via the Agent tool, that subagent gets its own fresh context window. It can do as much work as it needs to, and then synthesize its results so only the final report comes back to the parent.

The mental test we use: will I need this tool output again, or just the conclusion?

While Claude Code will automatically call subagents, you may want to tell it to explicitly do this. For example, you may want to tell it to:

- “Spin up a subagent to verify the result of this work based on the following spec file”
- “Spin off a subagent to read through this other codebase and summarize how it implemented the auth flow, then implement it yourself in the same way”
- “Spin off a subagent to write the docs on this feature based on my git changes”

# Summary

In summary, when Claude has ended a turn and you’re about to send a new message, you have a decision point.

Overtime we expect that Claude will help you handle this itself, but for now this is one of the ways you can guide Claude's output.

![图像](https://pbs.twimg.com/media/HF-qwt9bEAEa1eq?format=jpg&name=large)
