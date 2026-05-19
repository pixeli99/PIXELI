---
title: "FutureSim: Replaying World Events to Evaluate Adaptive Agents"
date: 2026-05-14
authors: ELLIS Tübingen / MPI-IS / EPFL
venue: arXiv preprint
link: https://arxiv.org/abs/2605.15188
tags: [Agent, Benchmark, Tool Use, Reasoning]
math: false
---

## 一句话

把 2026 年 Q1 的真实新闻按时间顺序回放给 agent，让它在 knowledge cutoff 之后用搜索 / 记忆 / 工具持续预测世界事件，最好的 frontier agent 只拿到 25%。

## 方法

benchmark 设计点：

- **chronological replay**：把 2026-01 至 2026-03 的真实新闻 article 按发生时间投喂给 agent，agent 在每个时间点必须基于"那个时刻能看到的信息"对未发生事件下注
- **resolution-grounded**：每个 question 都绑定一个客观可结算时间点（财报日 / 选举日 / 比赛结果），不需要人为标注
- **native config**：agent 用自己原生的 search、memory、long-context、tool 配置参赛，不强行 patch 接口

评测看两个量：accuracy 和 Brier skill score。

$$
\text{BSS} = 1 - \frac{\text{Brier}_\text{agent}}{\text{Brier}_\text{baseline}}
$$

结果：

- 最佳 agent 25% accuracy
- 不少 agent BSS < 0，比 random baseline 还差
- frontier agent 之间分化很明显，不是大家都贴着 ceiling

## 想法

这是我最近看到最少有"刷榜化"的 benchmark。一旦 leaderboard 锁死、问题集公开，下个版本就会被 agent 通过预训练数据污染，但 chronological replay + 时间窗滚动的设计天然能 mitigate——新闻每天都在产生，rolling 一遍就是新 split。

25% accuracy 不能光看做"agent 还不行"，要看 question 的 base rate 和题目难度分布。BSS<0 才是真问题——说明 agent 的 calibration 烂到不如平均先验，这点比 accuracy 更刺激。

可借鉴的点：把 evaluation 锚到客观时间结算，绕开 "LLM-as-judge"。但 paper 没说怎么防止 agent 在 search 时直接搜到未来时间点的新闻（cutoff hygiene 怎么保证）。这个工程细节如果做不干净，整套设定就崩了。

## 引用

{% raw %}
```bibtex
@article{goel2026futuresim,
  title   = {FutureSim: Replaying World Events to Evaluate Adaptive Agents},
  author  = {Goel, Shashwat and Chandak, Nikhil and Arun, Arvindh and Prabhu, Ameya and Staab, Steffen and Hardt, Moritz and Andriushchenko, Maksym and Geiping, Jonas},
  journal = {arXiv preprint arXiv:2605.15188},
  year    = {2026}
}
```
{% endraw %}
