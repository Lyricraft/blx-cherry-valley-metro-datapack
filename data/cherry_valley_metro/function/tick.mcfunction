execute as @e[type=minecraft:minecart, tag=cvm_cart] run function cherry_valley_metro:inner/remove_cart
execute as @a[tag=cvm_arriving] run function cherry_valley_metro:inner/player_arrive
execute as @e[type=minecraft:minecart, tag=cvm_force_stop] run function cherry_valley_metro:minecart_control/stop