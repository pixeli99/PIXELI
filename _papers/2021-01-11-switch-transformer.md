---
title: Switch Transformers - Scaling to Trillion Parameter Models with Simple and Efficient Sparsity
date: 2021-01-11
authors: Fedus, Zoph, Shazeer (Google)
venue: JMLR 2022
link: https://arxiv.org/abs/2101.03961
tags: [MoE, Sparse, Routing, Scaling, Training]
math: true
---

## 一句话

把 GShard 的 top-2 砍成 **top-1**，证明只路由到一个 expert 就够，配合 capacity factor 与 bf16 训练技巧，做到 **1.6T 参数**的 sparse encoder-decoder（"Switch-C"），相比 T5-XXL 同算力下预训练加速 ~7x。

## 方法

- Switch routing：每个 token 只走 gate 分数最高的那一个 expert，gate 输出直接作为 expert 输出的标量缩放
- 负载均衡 loss 沿用 GShard 形式 $\ell_{\mathrm{aux}} = \alpha \cdot N \sum_i f_i P_i$，$\alpha = 10^{-2}$
- capacity factor 默认 1.25（训练）/ 2.0（评估），超出 drop
- 工程细节：router 用 fp32 算 softmax 防 instability；expert dropout 比 attention dropout 大（0.4 vs 0.1）；初始化 scale 缩小 10x
- Switch-Base (7B) / Switch-Large (26B) / Switch-XXL (395B) / Switch-C (1.6T, 2048 expert)。SuperGLUE 上 fine-tune 也不掉点，破除了"sparse 模型迁移差"的偏见

## 想法

- top-1 的核心论证："多走一个 expert 收益小于 communication 成本"。从此 top-1 成为大多数后续工作的默认值（Mixtral 是少见的 top-2 回潮）
- 真正贡献其实在 training stability：fp32 router + 小 init，没这两条 trillion-scale 训不动
- 1.6T 这个数字宣传意义 > 实际意义。Switch-C 在 downstream 上反而不如 Switch-XXL，说明 expert 数太多 token 学不充分；后来很多工作都缩到 64–256 expert

## 引用

```bibtex
@article{fedus2022switch,
  title={Switch Transformers: Scaling to Trillion Parameter Models with Simple and Efficient Sparsity},
  author={Fedus, William and Zoph, Barret and Shazeer, Noam},
  journal={Journal of Machine Learning Research},
  volume={23},
  number={120},
  pages={1--39},
  year={2022}
}
```
