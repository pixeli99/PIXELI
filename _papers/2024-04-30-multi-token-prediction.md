---
title: Better & Faster Large Language Models via Multi-token Prediction
date: 2024-04-30
authors: Gloeckle, Idrissi, Rozière, Lopez-Paz, Synnaeve (Meta FAIR)
venue: ICML 2024
link: https://arxiv.org/abs/2404.19737
tags: [Training, Inference, Scaling]
math: true
description: 训练时让 LM 在同一个位置一次性预测后续多个 token（每个 future step 一个独立的 output head 共享 trunk），既能涨下游指标，又能在推理时直接当 speculative decoding 的 draft model 用，最高 3× wall-clock 加速。
---

## 一句话

训练时让 LM 在同一个位置一次性预测后续 $n$ 个 token（每个 future step 一个独立的 output head 共享 trunk），既能涨下游指标，又能在推理时直接当 speculative decoding 的 draft model 用，最高 3× wall-clock 加速。

## 方法

- 共享一个 Transformer trunk $f_\theta$，顶部挂 $n$ 个独立的 unembedding head $h_1, \dots, h_n$，第 $i$ 个 head 预测 $x_{t+i}$
- 损失是 $n$ 个 CE 的和：$\mathcal{L} = -\sum_{i=1}^{n} \log p_\theta(x_{t+i} \mid x_{\le t})$，反传时用 sequential head 写法避免同时把所有 head 的 logits 物化（vocab 大时省显存）
- 训练 13B 模型，$n=4$ 在 HumanEval / MBPP 等 code 任务上提升非常明显（HumanEval pass@1 +12% 量级），但在小模型（< 3B）上没收益，是 scale-dependent 的能力
- 推理时直接用同一个模型自己当 draft：trunk forward 一次拿到 $n$ 个候选，主模型再 verify，相比单 token 自回归 wall-clock 加速约 **3×**（code），自然语言上 1.5–2×

## 想法

- 这是 "next-token prediction 是不是太局部" 这条争论里少见的、纯训练目标层面给出正面证据的工作。Yann LeCun 长年念叨的 multi-step prediction，在这里以非常工程化的方式落了地
- 妙在没引入新的 KV 路径：$n$ 个 head 共享 trunk，推理时的 speculative decoding 不需要 draft model，省掉了 vicuna-style 双模型 setup 的所有麻烦
- 在 code 上的不对称收益值得追问——code 的局部依赖结构（语法 token 强相关）让 multi-token 目标天然便宜，自然语言的 entropy 分布更平所以收益小。这暗示这个 trick 的上限和任务的局部熵有关
- 后续 DeepSeek V3 / Qwen3 都把 MTP head 当标配引进训练，已经成事实标准

## 引用

```bibtex
@inproceedings{gloeckle2024better,
  title={Better \& Faster Large Language Models via Multi-token Prediction},
  author={Gloeckle, Fabian and Idrissi, Badr Youbi and Rozi{\`e}re, Baptiste and Lopez-Paz, David and Synnaeve, Gabriel},
  booktitle={ICML},
  year={2024}
}
```
