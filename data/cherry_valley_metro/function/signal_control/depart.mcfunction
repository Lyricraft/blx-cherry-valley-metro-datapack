# arguments:

# line
# station: 本站，或者说刚刚从那里出发的那一站
# direction: up / down

execute as @p on vehicle run tag @s add cvm_cart
$execute as @p run function cherry_valley_metro:signal_control/generated/depart_$(station)_$(line)_$(direction)