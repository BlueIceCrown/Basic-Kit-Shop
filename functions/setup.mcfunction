execute as @p run summon npc ~5 ~ ~5
tag @e[type=npc,x=~5,y=~,z=~5,r=2] add mainShopNPC
scoreboard objectives add Money dummy
scoreboard players add @p Money 1000000
tell @a "NPCs Loaded"