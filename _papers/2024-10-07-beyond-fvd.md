---
title: "Beyond FVD: Enhanced Evaluation Metrics for Video Generation Quality"
date: 2024-10-07
authors: Luo, Favero et al.
venue: ICLR 2025
link: https://arxiv.org/abs/2410.05203
tags: [Benchmark, Video, Generative]
math: true
---

## 一句话

把多年来沿用的 FVD 拆开看，列出三个本质缺陷，并给出 JEPA Embedding Distance（JEDi）作为替代，所需样本数只有原来 16%。

## 方法

FVD 标准形式是把生成视频和真实视频分别过 Inflated 3D ConvNet（I3D），取倒数第二层特征，假设其在两个数据集上都服从高斯，然后算 Fréchet 距离：

$$
\text{FVD} = \|\mu_g - \mu_r\|^2 + \mathrm{Tr}\bigl(\Sigma_g + \Sigma_r - 2(\Sigma_g \Sigma_r)^{1/2}\bigr)
$$

作者用三组实证证明这套全是漏：

1. **I3D 特征不服从高斯**：在多个数据集上跑 Shapiro-Wilk / multivariate normality test 直接拒掉，意味着 Fréchet 距离背后的假设不成立。
2. **对时间扰动不敏感**：把帧顺序打乱、丢帧、加抖动，I3D 特征几乎不变；FVD 对一个"语义对但运动错"的视频几乎不惩罚。
3. **样本量要求不切实际**：要让 FVD 估计稳定，每边动辄要数千乃至上万样本，小规模评测里方差大到结论翻面。

替代方案 **JEDi**：用 V-JEPA 的 self-supervised 特征替代 I3D，距离换成 polynomial kernel 的 Maximum Mean Discrepancy（MMD），样本效率上去——他们的实验里 16% 样本就能复现 FVD 在全样本下的判别力。

## 想法

FVD 被滥用得太久了，这种把"显然有问题的默认指标"系统性拆开的工作是 community 真正需要的。三条问题里第二条最致命：world model 的核心承诺是时间一致性，结果主要指标对时间不敏感，这是范畴错误。

JEDi 的实际命运取决于 V-JEPA 这条线后续是否稳定——绑死一个 self-supervised backbone，意味着 backbone 一升级，旧数字全失效。这是从一个有问题的固定指标换到一个变动的更好指标，要不要换还得看 community 取舍。WorldArena 那种"多维度 + 功能侧 grounding"看上去是更长远的方向。

## 引用

```bibtex
@inproceedings{luo2025beyondfvd,
  title     = {Beyond FVD: Enhanced Evaluation Metrics for Video Generation Quality},
  author    = {Luo, Ge Ya and Favero, Gianluca and others},
  booktitle = {International Conference on Learning Representations (ICLR)},
  year      = {2025}
}
```
