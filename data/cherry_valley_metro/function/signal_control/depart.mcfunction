# arguments:

# line
# station: 本站，或者说刚刚从那里出发的那一站
# direction: up / down

function cherry_valley_metro:signal_control/inner/before_signal
execute unless entity @n[type=minecraft:minecart, tag=cvm_cart, distance=..1] run return 0

$execute as @p run function cherry_valley_metro:signal_control/generated/depart_$(station)_$(line)_$(direction)