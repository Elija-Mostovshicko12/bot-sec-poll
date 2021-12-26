
//зона бота
const { Client, Intents} = require("discord.js");
const fs = require('fs');
const express = require('express')
const app = express()
const database = require('./database.js')
const DOMIN = 'localhost:3000';
const request = require('request')
const axios = require('axios'); 

const bot = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
});
bot.on("ready", () => {
    bot.user.setActivity('помощь мэру', { type: 'PLAYING' })
    database.load()
    console.log("[START] Ready to work");
});
process.on("SIGINT", ()=>{
    console.log("[END] Данные сохраняются...")
    database.save()
    console.log("[END] Данные сохранены")
    console.log("[END] Работа завершина")
    process.exit();
})
bot.login("OTIyMDc4NTQzOTc3MDAwOTgw.Yb8OkA.lQ1RH_1EWk7AfN6m6WErXs7EW1U");



bot.on("messageCreate", (msg)=>{
    let role_MER = msg.guild.roles.cache.get("872534213365219329")
    let role_SEC_MER = msg.guild.roles.cache.get("916364722247446568")
    let role_POLL_SH = msg.guild.roles.cache.get("872533313871544361")
    let role_POLL_cop = msg.guild.roles.cache.get("872534142120775700")
    let role_POLL_ml = msg.guild.roles.cache.get("872534027440115782")
    console.log(msg.inGuild())
    if(msg.inGuild() == true){
        const args = ((msg.content).split(' '));
        const prefex = ((msg.content).slice(0));
        console.log(`${prefex} + ${args}`);
        if(args[0] === '!/pass'){
            if(args[1] === 'get'){
                
                if(msg.member.roles.cache.has(role_MER.id) || msg.member.roles.cache.has(role_SEC_MER.id) || msg.member.roles.cache.has(role_POLL_SH.id) || msg.member.roles.cache.has(role_POLL_cop.id) || msg.member.roles.cache.has(role_POLL_ml.id)){

                }else{
                    return msg.channel.send("У тебя нет прав на использование этой командой!")
                }

                request('https://'+DOMIN +"/pass/get/"+args[2], function (error, response, body) {
                    let bboorr = JSON.parse(body);
                    console.log(`1) ${response}\n 2) ${body}`)
                    if(response.Error){
                        msg.channel.send('К сожелению таких данных не существует!!!')
                    }else{
                        msg.channel.send(`Данные по паспорту ${args[2]}: \n  - Имя: ${bboorr.data.name}\n  - Год рождения: ${bboorr.data.age}\n  - Номер паспорта: ${bboorr.data.SP}_${bboorr.data.NP}`)
                    }
                });
            }else if(args[1] === 'post'){
                if(msg.member.roles.cache.has(role_MER.id) || msg.member.roles.cache.has(role_SEC_MER.id)){

                }else{
                    return msg.channel.send("У тебя нет прав на использование этой командой!")
                }
                console.log('https://'+DOMIN +`/pass/post/${args[2]}/${args[3]}/${args[4]}/${args[5]}`)
                const url = 'https://'+DOMIN +`/pass/post/${args[2]}/${args[3]}/${args[4]}/${args[5]}`
                const reURL = encodeURI(url)
                axios.get(reURL)
                    .then((response) => {
                        const bboorr = response.data;
                        if(!bboorr.Error){
                            msg.channel.send(`Данные паспорта ${args[2]} от правлены на базу, база прислала результат: \n  - Имя: ${bboorr.data.name}\n  - Год рождения: ${bboorr.data.age}\n  - Номер паспорта: ${bboorr.data.SP}_${bboorr.data.NP}`)
                        }else{
                            msg.channel.send(`Данные паспорта уже существуют!!!`)
                        }
                    })
                    .catch((err) =>{

                        console.log(err)
                    })
                    
            }
        }else if(args[0] === '!/lec'){
            
            if(args[1] === 'get'){
                if(msg.member.roles.cache.has(role_MER.id) || msg.member.roles.cache.has(role_SEC_MER.id) || msg.member.roles.cache.has(role_POLL_SH.id) || msg.member.roles.cache.has(role_POLL_cop.id) || msg.member.roles.cache.has(role_POLL_ml.id)){

                }else{
                    return msg.channel.send("У тебя нет прав на использование этой командой!")
                }
                const url = encodeURI('http://'+DOMIN +"/lec/get/"+args[2])
                request( url, function (error, response, body) {
                    let bboorr = JSON.parse(body);
                    if(bboorr.Error){
                        msg.channel.send('К сожелению таких данных не существует!!!')
                    }else{
                        if(bboorr.data.type.length > 0){
                            msg.channel.send(`Данные по лицензии ${args[2]}: \n  - Имя: ${bboorr.data.name}\n  - Год рождения: ${bboorr.data.age}\n  - Номер лицензии: ${bboorr.data.SP}_${bboorr.data.NP}\_${bboorr.data.FB}\n - Типы лицензии: ${bboorr.data.type.join(' ')}`)
                        }else{
                            msg.channel.send(`Данные по лицензии ${args[2]}: \n  - Имя: ${bboorr.data.name}\n  - Год рождения: ${bboorr.data.age}\n  - Номер лицензии: ${bboorr.data.SP}_${bboorr.data.NP}\_${bboorr.data.FB}\n - Типы лицензии: нет`)
                        }
                       
                    }
                });
            }else if(args[1] === 'post'){
                if(msg.member.roles.cache.has(role_MER.id) || msg.member.roles.cache.has(role_SEC_MER.id)){

                }else{
                    return msg.channel.send("У тебя нет прав на использование этой командой!")
                }
                const url = encodeURI('http://'+DOMIN +`/lec/post/${args[2]}/${args[3]}/${args[4]}/${args[5]}`)
                 request(url, function (error, response, body) {
                     let bboorr = JSON.parse(body);
                    if(bboorr.Error){
                        msg.channel.send('К сожелению таких данных не существует!!!')
                    }else{
                        if(bboorr.data.type.length > 0){
                            msg.channel.send(`Данные по лицензии ${args[2]}: \n  - Имя: ${bboorr.data.name}\n  - Год рождения: ${bboorr.data.age}\n  - Номер лицензии: ${bboorr.data.SP}_${bboorr.data.NP}_${bboorr.data.FB}\n - Типы лицензии: ${bboorr.data.type.join(' ')}`)
                        }else{
                            msg.channel.send(`Данные по лицензии ${args[2]}: \n  - Имя: ${bboorr.data.name}\n  - Год рождения: ${bboorr.data.age}\n  - Номер лицензии: ${bboorr.data.SP}_${bboorr.data.NP}_${bboorr.data.FB}\n - Типы лицензии: нет`)
                        }
                    }
                });
            }else if(args[1] === 'add'){
                if(msg.member.roles.cache.has(role_MER.id) || msg.member.roles.cache.has(role_SEC_MER.id)){

                }else{
                    return msg.channel.send("У тебя нет прав на использование этой командой!")
                }
                const url = encodeURI('http://'+DOMIN +`/lec/add/${args[2]}/${args[3]}`)
                request(url, function (error, response, body) {
                    let bboorr = JSON.parse(body);
                    if(bboorr.Error){
                        msg.channel.send('К сожелению таких данных не существует!!!')
                    }else{
                        if(bboorr.data.type.length > 0){
                            msg.channel.send(`Данные по лицензии ${args[3]}: \n  - Имя: ${bboorr.data.name}\n  - Год рождения: ${bboorr.data.age}\n  - Номер лицензии: ${bboorr.data.SP}_${bboorr.data.NP}_${bboorr.data.FB}\n - Типы лицензии: ${bboorr.data.type.join(' ')}`)
                        }else{
                            msg.channel.send(`Данные по лицензии ${args[3]}: \n  - Имя: ${bboorr.data.name}\n  - Год рождения: ${bboorr.data.age}\n  - Номер лицензии: ${bboorr.data.SP}_${bboorr.data.NP}_${bboorr.data.FB}\n - Типы лицензии нет}`)
                        }
                       
                    }
                });
            }
        }
    }
})

//API зона
const num = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
const EN = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

app.listen(3000, ()=>{
    console.log("[API] Ready to work")
})

app.get('/pass/get/:data', (req, res)=>{
    if(req.params.data == null) return res.json({
                                "result": false,
                                "Error":001
                            })
    let PD = req.params.data.split('_')
    let data = database.Get_dataBase().pass
    let allD = Object.values(data)
    console.log(req.params.data);
    let fail = 0;
    for(let i = 0; i < allD.length; i++){
        if(allD[i].SP === PD[0] && allD[i].NP === PD[1]){
            return res.json({
                "result": true,
                "data": allD[i]
            })
        }else{
            fail ++
        }
    }
    if(fail == allD.length){
        return res.json({
            "result": false,
            "Error": 002
        })
    }
})

app.get('/pass/post/:nick/:name/:sname/:age', async (req, res)=>{
    if(req.params == null) return res.json({
                                "result": false,
                                "Error":11
                            })
    
    let dt = req.params;
    console.log("ddddddd  "+dt);
    let data = database.Get_dataBase().pass
    let allD = Object.values(data)
    for(let i = 0; i < allD.length; i++){
        if(allD[i].name === (dt.name + " "+ dt.sname) || allD[i].age === dt.age || Object.keys(data)[i] === dt.nick){
            return res.json({
                "result": false,
                "Error": 12
            })
        }
    }
    let rand_sm = await random_num();
    let result = await prov_random_num(rand_sm, 0)
    database.Get_dataBase().pass[dt.nick] = {
        "name": dt.name + " " + dt.sname,
        "age": dt.age,
        "SP": result.split(" ")[0],
        "NP": result.split(" ")[1],
    }
    res.json({
        "result": true,
        "data": {
            "name": dt.name + " " + dt.sname,
            "age": dt.age,
            "SP": result.split(" ")[0],
            "NP": result.split(" ")[1],
        }
    })
})

app.get('/lec/get/:data', (req, res)=>{
    if(req.params.data == null) return res.json({
                                "result": false,
                                "Error":31
                            })
    let PD = req.params.data.split('_')
    let data = database.Get_dataBase().lec
    let allD = Object.values(data)
    let fail = 0;
    for(let i = 0; i < allD.length; i++){
        if(allD[i].SP === PD[0] && allD[i].NP === PD[1] && allD[i].FB === PD[2]){
            return res.json({
                "result": true,
                "data": allD[i]
            })
        }else{
            fail ++
        }
    }
    if(fail == allD.length){
        return res.json({
            "result": false,
            "Error": 32
        })
    }
})

app.get('/lec/post/:nick/:name/:sname/:age', async (req, res)=>{
    if(req.params == null) return res.json({
                                "result": false,
                                "Error":41
                            })
    
    let dt = req.params;
    console.log(dt);
    let data = database.Get_dataBase().pass
    let allD = Object.values(data)
    for(let i = 0; i < allD.length; i++){
        if(allD[i].name === (dt.name + " "+ dt.sname) || Object.keys(data)[i] === dt.nick || allD[i].FB === ((dt.name).charAt(0) + (dt.sname).charAt(0)) && allD[i].age === dt.age){
            return res.json({
                "result": false,
                "Error": 42
            })
        }
    }
    let rand_sm = await random_num();
    let result = await prov_random_num(rand_sm, 0)
    database.Get_dataBase().lec[dt.nick] = {
        "name": dt.name + " " + dt.sname,
        "age": dt.age,
        "SP": result.split(" ")[0],
        "NP": result.split(" ")[1],
        "FB": (dt.name).charAt(0) + (dt.sname).charAt(0),
        "type":[]
    }
    res.json({
        "result": true,
        "data": {
            "name": dt.name + " " + dt.sname,
            "age": dt.age,
            "SP": result.split(" ")[0],
            "NP": result.split(" ")[1],
            "FB": (dt.name).charAt(0) + (dt.sname).charAt(0),
            "type":[]
        }
    })
})

app.get("/lec/add/:data/:type", (req, res)=>{
    if(req.params == null) return res.json({
        "result": false,
        "Error":51
    })
    let dt = req.params;
    let PD = req.params.data.split('_')
    let data = database.Get_dataBase().lec
    let allD = Object.values(data)

    for(let i = 0; i < allD.length; i++){
        if(allD[i].SP === PD[0] && allD[i].NP === PD[1] && allD[i].FB === PD[2]){
            let ff = allD[i].type;
            ff.push(req.params.type)
            let gg = {
                    "name": allD[i].name,
                    "age": allD[i].age,
                    "SP": allD[i].SP,
                    "NP": allD[i].NP,
                    "FB": allD[i].FB,
                    "type": ff
                }
        
        
            database.Get_dataBase().lec[(Object.keys(data))[i]] = gg
            return res.json({
                "result": true,
                "data": gg
            })
        
        }else{
            fail ++
        }
    }
    if(fail == allD.length){
        return res.json({
            "result": false,
            "Error": 32
        })
    }

})

async function random_num (){
    let res = [];
    for(let i = 0; i < 10;i++){
            let it = Math.floor(Math.random() * num.length);
            let tii = num[it];
            res.push(tii);
    }
    return res.join('')
}

async function prov_random_num (dataP, BU){
    let PD = dataP
    let data = database.Get_dataBase().pass
    let allD = Object.values(data)
    let fail = 0;
    for(let i = 0; i < allD.length; i++){
        if(allD[i].NP === PD){
            let rn = await random_num()
            return prov_random_num(rn, BU)
        }else{
            fail ++
        }
    }
    if(fail == allD.length){
        return `AA ${dataP}`
    }
}