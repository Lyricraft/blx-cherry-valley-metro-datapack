scoreboard players set @s cvm_reg0 0
execute on vehicle on passengers run scoreboard players set @s cvm_reg0 1
execute if entity @s[scores={cvm_reg0=0}] run tag @s remove cvm_arriving

execute at @s unless block ~ ~ ~ minecraft:magenta_glazed_terracotta unless block ~ ~1 ~ minecraft:activator_rail run return 0

tag @s remove cvm_arriving

execute at @s if block ~ ~1 ~ minecraft:activator_rail on vehicle run tag @s add cvm_force_stop
execute on vehicle if entity @s[tag=cvm_force_stop] on passengers run title @s actionbar {text: "已到终点站，请下车", color: "red"}
execute on vehicle if entity @s[tag=cvm_force_stop] run return 0

execute on vehicle run function cherry_valley_metro:minecart_control/stop
title @s actionbar {text: "已到站，请下车或继续前进", color: "green"}