# arguments:

# line
# station
# direction: up / down

$execute as @p run function cherry_valley_metro:signal_control/generated/arrive_$(station)_$(line)_$(direction)

tag @p add cvm_arriving
execute as @p on vehicle run function cherry_valley_metro:minecart_control/slow_down