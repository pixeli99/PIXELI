---
title: Branch-Train-Merge - Embarrassingly Parallel Training of Expert Language Models
date: 2022-08-05
authors: Li, Gururangan, Dettmers, Lewis, Althoff, Smith, Zettlemoyer (UW + Meta)
venue: arXiv preprint
link: https://arxiv.org/abs/2208.03306
tags: [MoE, Training, Scaling, Routing]
math: true
---

## 一句话

把一颗大 LM 拆成一片"专家森林"（Expert LM, ELM），每棵 ELM 在自己的 domain 数据上独立训练，最后用参数平均 / ensemble / 后续 BTX 升格成 sparse MoE 的方式合并起来，从根上去掉 multi-node 同步开销。

## 方法

- Branch：从一个 seed LM 出发，对每个新 domain $d$ 用现有 ELMs 在 $d$ 上的 likelihood 当权重做参数加权平均，作为该 ELM 的初值
- Train：每棵 ELM 在自己的 domain 上独立做 CE，**完全无通信**
- Merge：推理时两种路子——(a) 在输出 logits 上按 domain posterior $p(d \mid x)$ 做 ensemble；(b) 直接对所有 ELM 参数求平均回退到一个 dense LM
- 实验在 8 个 domain（C4、CC-news、Reddit、code、science、legal 等）上各训一个 1.3B ELM，total 10.4B 参数；in-domain ppl 优于同算力的 GPT-style dense，out-of-domain 也有收益
- 续作 Branch-Train-MiX (2403.07816) 把 ELM 的 FFN 直接当 expert 塞进 MoE 层，路由 router 再 fine-tune 一下，比 BTM 的 logit ensemble 更工程化

## 想法

- 这条线和 Switch / GShard 那种"先 MoE 后 train"完全反过来：先 train 再 MoE。好处是 expert 真的有 domain 语义，不是 router 学出来的伪簇；坏处是 domain 标签得人手切，cross-domain 泛化要靠 router 后训
- 参数平均做 init 是个老 trick（model soup），这里给了一个工程化的递归用法
- 真正的工业意义在 BTX——它给"开源社区独立训小专家、再拼成大 MoE"提供了路径，可以解释为什么后来 OLMoE、Mixtral 之后大家都开始 upcycle dense checkpoint 而不是从头训 sparse

## 引用

```bibtex
@article{li2022branch,
  title={Branch-Train-Merge: Embarrassingly Parallel Training of Expert Language Models},
  author={Li, Margaret and Gururangan, Suchin and Dettmers, Tim and Lewis, Mike and Althoff, Tim and Smith, Noah A. and Zettlemoyer, Luke},
  journal={arXiv preprint arXiv:2208.03306},
  year={2022}
}
```
