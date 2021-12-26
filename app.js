const { Client, Intents, WebhookClient} = require("discord.js");
const { joinVoiceChannel, createAudioResource, createAudioPlayer, AudioPlayerStatus } = require("@discordjs/voice");
const { addSpeechEvent } = require("discord-speech-recognition");
const fs = require('fs')
const timeout = require('timeout')

const bot = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
});

const WebHook = new WebhookClient({id:"872561479474360323", token:"iiaBrnJe_I9z1AMlfFu7X_yHCLa221S71Eamt2_mMYDzgIk_epj1Zh6I8VHGAf8kyTg0", url:"https://discord.com/api/webhooks/872561479474360323/iiaBrnJe_I9z1AMlfFu7X_yHCLa221S71Eamt2_mMYDzgIk_epj1Zh6I8VHGAf8kyTg0"});

addSpeechEvent(bot, { lang: ["ru-RU", "en-US"]});

let SpeechST = false;
let data = {
  UID: null,
  SpeechST: false,
  slova:[],
}

let ochered = []
const player = createAudioPlayer();
const resource = createAudioResource(__dirname+'/911.mp3');

bot.on("message", (msg) => {
    if(msg.author.bot) return;
    if(msg.content === "911!REQ"){
      if(SpeechST == false){
        SpeechST = true
        const voiceChannel = msg.member.voice.channel;
        if (voiceChannel) {
        const conn = joinVoiceChannel({
          channelId: voiceChannel.id,
          guildId: voiceChannel.guild.id,
          adapterCreator: voiceChannel.guild.voiceAdapterCreator,
          selfDeaf: false,
        })
      }else{
        SpeechST = false
        const voiceChannel = msg.member.voice.channel;
        if (voiceChannel) {
        const conn = joinVoiceChannel({
          channelId: voiceChannel.id,
          guildId: voiceChannel.guild.id,
          adapterCreator: voiceChannel.guild.voiceAdapterCreator,
          selfDeaf: false,
        })
      }
    }
  }
}

});
async function Reqord (chanel, user, player){
    const voiceChannel = chanel;
      const conn = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        selfDeaf: false,
      })
      const resource = createAudioResource(__dirname+'/911.mp3');
      player.play(resource);
      conn.subscribe(player);
      player.on(AudioPlayerStatus.Idle, () => {
        timeout.timeout('Req',60000,function(){
          data.SpeechST = false;
          data.UID = null;
          let red_slova = []
          for(let t = 0 ; t<data.slova.length ; t++){
            if(data.slova[t] === undefined){
              red_slova.push("(Данное слово не разборчиво прозвучало)")
            }else{
              red_slova.push(data.slova[t]);
            }
          }
          WebHook.send(`Срочная новасть этому человеку <@${user.id}>  нужна срочная помощь, он позвонил по 911, вот что он говорил: \n ${red_slova.join(' ')}`)
          data.slova = [];
          user.disconnect().catch(()=>{})
        })
      });
}

async function STOP (chanel, player){
  const voiceChannel = chanel;
    const conn = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      selfDeaf: false,
    })
    timeout.timeout('Req', null)
    player.stop();
    conn.subscribe(player);
}
bot.on('voiceStateUpdate', (oldMember, newMember) => {
  if (oldMember.member.user.bot || newMember.member.user.bot) return;
	let oldUserChannel = oldMember.channelId;
  let newUserChannel = newMember.channelId;
  let nch = newMember.channel;
  let och =  oldMember.channel;
	let OCH = bot.channels.cache.find(channel => channel.id === '872548922990661672');//[+] Служба спасения
  let chan1 = bot.channels.cache.find(channel => channel.id === '872789369772187679');//Зал Ожидания
	let chan2 = bot.channels.cache.find(channel => channel.id === '872789354001616947');//Зал Записи
	let mem = [];

	if(newUserChannel === OCH.id){
    if(chan2.members.size >= 2){
      newMember.setChannel(chan1);
      ochered.push(newMember.id)
      console.log(ochered)
      newMember.member.send(`К сожелению но Оператор уже занят, подождите в очереди. ВЫ В ОЧЕРЕДИ ${ochered.length}`).catch(()=>{
        console.log('-----------')
      })
    }else{
      newMember.setChannel(chan2).then(()=>{
        data.UID = newMember.id;
        data.SpeechST = true;
        Reqord(chan2, newMember, player)
      });
      
    }

	}else if(oldUserChannel === OCH.id){
    console.log("Вышел")
  
    
	}
  if(oldUserChannel === chan1.id){
    for(let i = 0; i< ochered.length; i++){
      if(ochered[i] == oldMember.id){
        delete ochered[i];
        oldMember.member.send("Вы были исключены из очереди").catch(()=>{
          console.log('-----------')
        })
        console.log(ochered)
      }
    }
  }
  if(oldUserChannel === chan2.id){
    
      let gu = bot.guilds.cache.get('872532335218819153');
        oldMember.member.send("Спасибо большое что оставили нам ваше сообщение. Мы передаём ваше сообщение в определённые службы").catch(()=>{
          console.log('-----------')
        })
        if(ochered.length == 0){
          STOP(chan2, player).then(()=>{
            let mem = gu.members.cache.get(ochered.shift())
            timeout.timeout('Req', null)
            let red_slova = []
          for(let t = 0 ; t<data.slova.length ; t++){
            if(data.slova[t] === undefined){
              red_slova.push("(Данное слово не разборчиво прозвучало)")
            }else{
              red_slova.push(data.slova[t]);
            }
          }
            WebHook.send(`Срочная новасть этому человеку <@${oldMember.id}>  нужна срочная помощь, он позвонил по 911, вот что он говорил: \n ${red_slova.join(' ')}`)
            data.slova = [];
          })
          return
        }else{
        STOP(chan2, player).then(()=>{
          let mem = gu.members.cache.get(ochered.shift())
          timeout.timeout('Req', null)
          console.log(ochered);
          console.log(mem);
          let red_slova = []
          for(let t = 0 ; t<data.slova.length ; t++){
            if(data.slova[t] === undefined){
              red_slova.push("(Данное слово не разборчиво прозвучало)")
            }else{
              red_slova.push(data.slova[t]);
            }
          }
          WebHook.send(`Срочная новасть этому человеку <@${oldMember.id}>  нужна срочная помощь, он позвонил по 911, вот что он говорил: \n ${red_slova.join(' ')}`)
          data.slova = [];
          mem.voice.setChannel(chan2).then(()=>{
            Reqord(chan2, mem, player)
          })
          
        })
      }

          
  }
});

bot.on("speech", (msg) => {
  if(data.SpeechST === true){
    data.slova.push(msg.content);
  }
});

bot.on("ready", () => {
  console.log("Ready!");
  bot.user.setActivity(' о прозьбе помощи', { type: 'WATCHING' })
});

bot.login("Ваш токин бота");