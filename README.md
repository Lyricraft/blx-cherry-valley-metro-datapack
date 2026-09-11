# 樱谷地铁 Cherry Valley Metro

樱谷地铁是一个 Minecraft 数据包，为玩家自建的地铁线路提供运营模拟：乘客乘坐矿车出行时，随车接收中英双语的到站/出发播报、换乘与终点站提示；系统负责进站减速、站台停车、空车回收，以及在越过运营终点站时的扣停保护。

目标版本：Minecraft 26.2。

线路与车站等内容以 YAML 维护在 `content/` 下，构建时由脚本生成对应的 mcfunction，与手写的运行时逻辑一起打包。

## 构建

需要 Node.js >= 18。

```bash
npm install
npm run build
```

构建流水线：

1. **加载**：读取 `content/` 下的 YAML，建立线路与车站模型；
2. **生成**：生成报站等 mcfunction 到 `data_generated/`（纯暂存区，每次构建清空重建）；
3. **导出**：以 `data/`（手写运行时）为基底，用 `data_generated/` 覆盖叠加，输出到 `dist/`——`<outputName>/` 文件夹与 `<outputName>.zip` 各一份。

发布件名称与格式由 `build.yml` 配置：`outputName` 支持 `${name}`、`${version}` 占位符，`outputFormat` 可选 `folder`、`zip`。

## 目录结构

| 路径 | 说明 |
| --- | --- |
| `content/` | 内容源：`metro.yml` 全局配置，`line/*.yml` 线路，`station/*.yml` 共享车站 |
| `src/` | 构建逻辑（ESM + JSDoc，无需编译） |
| `data/` | 手写的运行时数据包内容（函数、标签） |
| `data_generated/` | 生成暂存区，不入库 |
| `dist/` | 构建产物，不入库 |
| `build.yml` | 构建配置 |
| `pack.mcmeta` | 数据包元信息 |

## 内容编写

### `content/metro.yml`

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `name` | 是 | 网络名称，如 `樱谷地铁` |
| `name_en` | 否 | 英文名，缺省同 `name` |
| `door_side` | 否 | 全局默认门侧，缺省 `left`；可写 `left`/`right` 或 `{ up: …, down: … }` |

### `content/line/<线路id>.yml`

文件名即线路 id（如 `line_1.yml`）。

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `name` | 是 | 线路名称 |
| `name_en` | 否 | 英文名，缺省同 `name` |
| `color` | 是 | 十六进制颜色，如 `"#b22222"` |
| `stations` | 是 | 非空站点列表；列表从上行端排到下行端（靠前的站位于靠后站的上行侧） |

站点条目两种写法：

- 引用共享车站：`reference: <车站id>`（不能再写 `id`）；
- 内联定义车站：`id` + `name`（+ 可选 `name_en`）；同一 id 重复定义时名称必须一致。

两者均可附加：

| 字段 | 说明 |
| --- | --- |
| `door_side` | 覆盖默认门侧；`left`/`right` 或 `{ up: …, down: … }`，可只写一侧 |
| `open` | 是否开通运营，缺省 `true` |

门侧以**列车行进方向**为参照：`up` 指逆 `stations` 列表顺序行驶（上行），`down` 指按列表顺序行驶（下行）。

### `content/station/<车站id>.yml`

文件名即车站 id。字段：`name`（必填）、`name_en`（可选）。共享车站被多条线路以 `reference` 引用，在模型中是同一个实例。

## 运行时（`data/`）

数据包通过 `load` / `tick` 函数标签接入游戏：

| 函数 | 作用 |
| --- | --- |
| `cherry_valley_metro:load` | 初始化计分板 |
| `cherry_valley_metro:tick` | 每 tick 调度：空车回收、到站检测、扣停 |
| `signal_control/arrive` | 进站宏函数（参数 `line` / `station` / `direction`）：转发报站，标记乘客，开始减速 |
| `signal_control/depart` | 出发宏函数（同参数）：转发出发播报；向运营终点外出发时扣停 |
| `signal_control/generated/*` | 构建生成的报站函数（`arrive_*` / `depart_*`），每站每方向一个，请勿手改 |
| `minecart_control/slow_down`、`stop` | 进站减速、停车 |
| `inner/*` | 到站处理与空车回收的内部逻辑 |

运行期约定：计分板 `cvm_imm` / `cvm_reg0` 为临时量；实体 tag 中 `cvm_cart` 标记在役车厢、`cvm_arriving` 标记进站中的乘客、`cvm_force_stop` 标记扣停中的车厢。

## 许可

MIT License，见 [LICENSE](LICENSE)。

作者：Lyricraft
