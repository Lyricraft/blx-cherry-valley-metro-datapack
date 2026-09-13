tag @n[type=minecraft:minecart] add cvm_cart

scoreboard players set @n[type=minecraft:minecart] cvm_reg0 0
execute as @n[type=minecraft:minecart] on passengers on vehicle run scoreboard players set @s cvm_reg0 1
execute as @n[type=minecraft:minecart] if entity @s[scores={cvm_reg0=0}] run kill @s