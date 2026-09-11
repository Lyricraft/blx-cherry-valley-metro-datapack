scoreboard players set @s cvm_imm 2
execute store result score @s cvm_reg0 run data get entity @s Motion[0] 1000
scoreboard players operation @s cvm_reg0 /= @s cvm_imm
execute store result entity @s Motion[0] double 0.001 run scoreboard players get @s cvm_reg0
execute store result score @s cvm_reg0 run data get entity @s Motion[1] 1000
scoreboard players operation @s cvm_reg0 /= @s cvm_imm
execute store result entity @s Motion[1] double 0.001 run scoreboard players get @s cvm_reg0
execute store result score @s cvm_reg0 run data get entity @s Motion[2] 1000
scoreboard players operation @s cvm_reg0 /= @s cvm_imm
execute store result entity @s Motion[2] double 0.001 run scoreboard players get @s cvm_reg0