![RedBot](https://github.com/guidone/node-red-contrib-chatbot/raw/master/docs/logo/RedBot_logo_small.png)


This is an enhancement to the node-red-contrib-chatbot modules.
https://github.com/guidone/node-red-contrib-chatbot/

New Nodes are 

* Slack ListChannels

* Slack ListUsers

Future nodes

* get User Info 

* get Channel Info 

* any other MetaAction that might be helpful

Example Get User (Missing the slack listener) 
```
[{"id":"84bab50.0011a48","type":"grok","z":"7e33e386.3322ac","field":"content","regex":"%{WORD:action}\\s+(?<userid>.*)","x":190,"y":40,"wires":[["bc4798d4.145d58"]]},{"id":"6917cb9c.54cb44","type":"chatbot-message","z":"7e33e386.3322ac","name":"","message":[{"message":""}],"answer":false,"track":false,"x":630,"y":140,"wires":[["f1770f5b.10928"]]},{"id":"f1770f5b.10928","type":"chatbot-slack-send","z":"7e33e386.3322ac","bot":"5ea831a0.e4c67","botProduction":"5ea831a0.e4c67","track":false,"outputs":0,"x":730,"y":220,"wires":[]},{"id":"bc4798d4.145d58","type":"chatbot-slack-getuser","z":"7e33e386.3322ac","botProduction":"5ea831a0.e4c67","field":"userid","x":200,"y":140,"wires":[["3cecf370.4d8f9c"]]},{"id":"3cecf370.4d8f9c","type":"switch","z":"7e33e386.3322ac","name":"","property":"type","propertyType":"msg","rules":[{"t":"eq","v":"error","vt":"str"},{"t":"else"}],"checkall":"true","repair":false,"outputs":2,"x":210,"y":220,"wires":[["46bb727e.8963ec"],["3bde8d01.d48ed2"]]},{"id":"46bb727e.8963ec","type":"change","z":"7e33e386.3322ac","name":"Error","rules":[{"t":"set","p":"payload","pt":"msg","to":"userinfo.message","tot":"msg"}],"action":"","property":"","from":"","to":"","reg":false,"x":450,"y":140,"wires":[["6917cb9c.54cb44"]]},{"id":"3bde8d01.d48ed2","type":"change","z":"7e33e386.3322ac","name":"userinfo","rules":[{"t":"set","p":"payload","pt":"msg","to":"userinfo","tot":"msg"}],"action":"","property":"","from":"","to":"","reg":false,"x":400,"y":220,"wires":[["d6c9db00.a4cc48"]]},{"id":"d6c9db00.a4cc48","type":"json","z":"7e33e386.3322ac","name":"","property":"payload","action":"","pretty":true,"x":550,"y":220,"wires":[["6917cb9c.54cb44"]]},{"id":"5ea831a0.e4c67","type":"chatbot-slack-node","z":"","botname":"mybot","usernames":"my-Chatbot","store":"2db3eb45.ee5724","log":"unixbot.txt","debug":false},{"id":"2db3eb45.ee5724","type":"chatbot-context-store","z":"","name":"context","contextStorage":"memory","contextParams":""}]
```
