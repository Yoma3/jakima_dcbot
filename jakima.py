import discord
from discord.ext import commands
token = ''
bot = commands.Bot(command_prefix = '!')

@bot.event
async def on_ready():
    print('Bot je online')
    
@bot.event    
async def on_member_join(member):
    print(f'{member} has joined the server.')

@bot.event    
async def on_member_remove(member):
    print(f'{member} has left the server.')

@bot.command()
async def ping(ctx):
    await ctx.send(f'Pong! {round(bot.latency * 1000)} ms')

@bot.command()
async def clear(ctx, amount = 5):
    await ctx.channel.purge(limit = amount)

bot.run(token)
