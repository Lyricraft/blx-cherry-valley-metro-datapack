scoreboard players set @s cvm_reg0 0 
execute on passengers on vehicle run scoreboard players set @s cvm_reg0 1
execute if score @s cvm_reg0 matches 0 run kill @s