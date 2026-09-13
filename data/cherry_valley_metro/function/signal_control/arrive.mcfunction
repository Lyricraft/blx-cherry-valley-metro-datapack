# arguments:

# line
# station
# direction: up / down

function cherry_valley_metro:signal_control/inner/before_signal
execute unless entity @n[type=minecraft:minecart, tag=cvm_cart, distance=..1] run return 0

$execute as @p run function cherry_valley_metro:signal_control/generated/arrive_$(station)_$(line)_$(direction)

tag @p add cvm_arriving
execute as @p on vehicle run function cherry_valley_metro:minecart_control/slow_down