---
title: "Prompting Policies for Multi-step Reasoning and Tool-Use in Black-box LLMs with Iterative Distillation of Experience"
date: 2026-05-14
authors: Google
venue: arXiv preprint
link: https://arxiv.org/abs/2605.14443
tags: [RL, Reasoning, Tool Use, Post-Training]
math: true
---

## 一句话

不动 frozen worker LLM，单独训一个小 prompter 模型用 RL 写 prompt，把"反复 reflection + 重写"的过程蒸馏成单步策略权重。

## 方法

设置：worker $\pi_W$ 大、frozen；prompter $\pi_P$ 小、可训。prompter 看到任务 $x$，吐一个 prompt $p$；worker 用 $p$ 做完任务拿到 reward $r$。目标：

$$
\max_{\pi_P} \;\mathbb{E}_{x, p \sim \pi_P}\!\bigl[\, r\bigl(\pi_W(\cdot \mid p, x)\bigr) \,\bigr]
$$

但单纯 PG 学不动——reward 稀疏，prompt 空间巨大。他们的 trick 是 **contrastive experience buffer**：每个 trajectory 不只记 scalar reward，还存一段 textual critique（"这个 prompt 没让 worker 调对工具"），把数值奖励和自然语言反馈一起喂回 prompter。把"反复 reflection"那种 test-time 迭代过程，amortize 到 weights 里。

数字：

- Big Bench Extra Hard（logic-intensive）：55% → 90%
- τ-bench（tool use）：74% → 91%
- 比 GEPA 这种进化式 prompt search 的 baseline sample-efficient

## 想法

"prompter / worker"双模型这个结构在 2024-2025 就有人玩，但大多卡在 reward 稀疏。把 critique 作为 contrastive signal 一起喂——这点很像 DPO 的 textual 版，跟近期 GEPA、PromptBreeder 比是个干净的设计。

我有点怀疑 55→90 的提升幅度。Big Bench Extra Hard 题目少、子题分布尖锐，prompter 很可能学到几种 task-type 触发器（"先列方程再代值"那种 meta-prompt），这种提升能不能迁移到没见过的 reasoning 任务是关键。paper 应该做一个 held-out task type 的 split。

可借鉴的点：把 reflection 过程蒸到 prompter weights 里——这是 inference-time → train-time 的转化，省 token 又快。生产 agent 系统里这个 pattern 应该比 chain-of-thought-at-test-time 更值得押注。

## 引用

{% raw %}
```bibtex
@article{sayana2026ide,
  title   = {Prompting Policies for Multi-step Reasoning and Tool-Use in Black-box LLMs with Iterative Distillation of Experience},
  author  = {Sayana, Krishna and Todi, Ketan and Jash, Ambarish},
  journal = {arXiv preprint arXiv:2605.14443},
  year    = {2026}
}
```
{% endraw %}
