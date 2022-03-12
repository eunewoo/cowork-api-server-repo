const express = require('express');

const app = express();

const db = require('./models');

const { Member } = db;

app.use(express.json());

app.get('/hello', (req, res) => {
    res.send('<h1>Hello express of cooksite</h1>');
});


app.get('/', (req, res) => {
    res.send('URL should contain /api/..');
});

app.get('api/members', async (req, res) => {
    const { team } = req.query;

    if (team) {
        const teamMembers = await Member.findAll({ where: { team } });
        res.send(teamMembers);
    } else {
        const members = await Member.findAll();
        res.send(members);
    }
});

app.get('api/members/:id', async (req, res) => {
    const { id } = req.params;
    const member = await Member.findOne({ where: { id } });

    if (member) {
        res.send(member);
    } else {
        res.status(404).send({ message: 'There is no such member dude' });
    }
});

app.post('api/members', async (req, res) => {
    const newMember = req.body;
    const member = Member.build(newMember);
    await member.save();
    res.send(member);
});

app.put('api/members/:id', async (req, res) => {
    const { id } = req.params;
    const newInfo = req.body;

    const member = await Member.findOne({ where: { id } });

    Object.keys(newInfo).forEach((prop) => {
        member[prop] = newInfo[prop];
    });
    await member.save();
    res.send(member);
});


app.delete('api/members/:id', async (req, res) => {
    const { id } = req.params;
    const deletedCount = await Member.destroy({ where: { id } });

    if (deletedCount) {
        res.send({ message: `${deletedCount} row(s) deleted` });
    } else {
        res.status(404).send({ message: 'There is no member with the id!' });
    }
});




app.listen(process.env.PORT || 3000, () => {
    console.log('Server is listening...');
});
