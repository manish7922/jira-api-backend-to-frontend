var express = require("express");
let mysql=require("mysql2");
const axios = require('axios');
var app = express();
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,Authorization,WWW-Authenticate,Authentication"
  );

  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  next();
});
const port = process.env.PORT || 2411;

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"manish",
    database:"testDb",
    insecureAuth : true
  });


app.listen(port, () => console.log(`Node app listening on port ${port}!`));

// task 1 fetch data for tickets ,save and update database 

app.get('/fetchTickets', async (req, res) => {
  try {
    let startAt = 0;
    const maxResults = 10;
    const allTickets = [];
    

    while (true) {
      const response = await axios.get(
        'https://123458498987.atlassian.net/rest/api/2/search',
        {
          auth: {
            username: 'thakurms7983@gmail.com',
            password: 'ATATT3xFfGF0th4Mu-nRva3bE-lNaohJMDc-_RKtMZKi8yBr9tnN61o4hYdsJlVRAw-uCmkxVKONsqcCzoCesPFej0SwxSfTx4NLE2b3z61sTMWTNvxHOaXD0v29vYuP6Xi8ZVaMgn93WG0zbYceQEX5Ce9jm098tYwxxan4a3Kjc2PsirRc_dI=0FB810C1',
          },
          params: {
            jql: 'project = KAN',
            startAt,
            maxResults,
          },
          timeout:50000
        }
      );

      const tickets = response.data.issues.map((issue) => ({
        number: issue.key,
        name: issue.fields.summary,
        description: issue.fields.description,
        reporter: issue.fields.reporter.displayName,
        status: issue.fields.status.name,
        dueDate: issue.fields.duedate,
      }));

      if (tickets.length === 0) {
        break; 
      }

      allTickets.push(...tickets);
      startAt += maxResults;
    }

console.log("allTickest",allTickets);
    for (let i = 0; i < allTickets.length; i++) {
      const ticket = allTickets[i];
      const existingTicket = await getTicketDatabase(ticket.number);

      if (existingTicket) {
        const updateQuery = `
          UPDATE jira
          SET name = ?, description = ?, reporter = ?, status = ?, duedate = ?
          WHERE number = ?`;

        const updateValues = [
          ticket.name,
          ticket.description,
          ticket.reporter,
          ticket.status,
          ticket.dueDate,
          ticket.number
        ];

        
        db.query(updateQuery, updateValues, (err, result) => {
          if (err) {
            console.error('Error updating ticket:', err);
          } else {
            console.log(`Ticket ${ticket.number} updated`);
          }
        });
      } else {
        const insertQuery = `
          INSERT INTO jira (number, name, description, reporter, status, duedate)
          VALUES (?, ?, ?, ?, ?, ?)`;

        const insertValues = [
          ticket.number,
          ticket.name,
          ticket.description,
          ticket.reporter,
          ticket.status,
          ticket.dueDate
        ];

        db.query(insertQuery, insertValues, (err, result) => {
          if (err) {
            console.error('Error inserting new ticket:', err);
          } else {
            console.log(`New ticket ${ticket.number} inserted`);
          }
        });
      }
    }

    res.json(allTickets);
  } catch (error) {
    console.error('Error fetching and saving tickets:', error.response ? error.response.data : error.message);
    res.status(500).send('An error occurred');
  }
});

async function getTicketDatabase(ticketNumber) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM jira WHERE number = ?';
    db.query(query, [ticketNumber], (err, results) => {
      if (err) {
        reject(err);
      } else {
        if (results.length > 0) {
          resolve(results[0]);
        } else {
          resolve(null);
        }
      }
    });
  });
}
//  task 2 update status and comment send 
 app.post('/closeIssue/:key', async (req, res) => {
let key =req.params.key;
console.log(key);
 const jiraApi = 'https://123458498987.atlassian.net/rest/api/3/issue';
const issueKey= key; 
const token = 'ATATT3xFfGF0th4Mu-nRva3bE-lNaohJMDc-_RKtMZKi8yBr9tnN61o4hYdsJlVRAw-uCmkxVKONsqcCzoCesPFej0SwxSfTx4NLE2b3z61sTMWTNvxHOaXD0v29vYuP6Xi8ZVaMgn93WG0zbYceQEX5Ce9jm098tYwxxan4a3Kjc2PsirRc_dI=0FB810C1';  
let transitionID=req.body.transitionID;
console.log("ID",transitionID);
    try {
      const transitionUrl = `${jiraApi}/${issueKey}/transitions`;
  console.log("hyyy");
      const transitionMessage = {
        // body: {
        //   type: 'doc',
        //   version: 1,
        //   content: [
        //     {
        //       type: 'paragraph',
        //       content: [
        //         {
        //           type: 'text',
        //           text: req.body.comment,
        //         },
        //       ],
        //     },
        //   ],
        // },
        transition: {
          id:transitionID,
        },
        // update: {
        //   comment: [
        //     {
        //       add: {
        //         body: {
        //           type: "doc",
        //           content: [
        //             {
        //               type: "paragraph",
        //               content: [
        //                 {
        //                   text: "My internal comment.",
        //                   type: "text"
        //                 }
        //               ]
        //             }
        //           ]
        //         }
        //       },
        //     },
        //   ],
        // },

      };
  
      const Transitionresponse = await axios.post(transitionUrl, transitionMessage, {
        headers: {
          Authorization: `Basic ${Buffer.from(`thakurms7983@gmail.com:${token}`).toString('base64')}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(Transitionresponse);
      console.log("hyyy");
     
   
      const commentUrl = `${jiraApi}/${issueKey}/comment`;
      const commentMessage={
        body: {
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: req.body.comment,
                },
              ],
            },
          ],
        },
      }
   
      console.log("hyyy1");
      const commentResponse = await axios.post(commentUrl, commentMessage, {
        headers: {
          Authorization: `Basic ${Buffer.from(`thakurms7983@gmail.com:${token}`).toString('base64')}`,
          'Content-Type': 'application/json',
        },
      });
      console.log("hyyy3");
      console.log(commentResponse);
       res.status(200).json({ message: 'Issue updated successfully.', response: Transitionresponse.statusText });
   
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: 'An error occurred.' });
    }
  });

  app.post("/updateComment/:key", async (req,res)=>{
    let key=req.params.key;
    const jiraApi="https://123458498987.atlassian.net/rest/api/3/issue";
    const jiraToken="ATATT3xFfGF0th4Mu-nRva3bE-lNaohJMDc-_RKtMZKi8yBr9tnN61o4hYdsJlVRAw-uCmkxVKONsqcCzoCesPFej0SwxSfTx4NLE2b3z61sTMWTNvxHOaXD0v29vYuP6Xi8ZVaMgn93WG0zbYceQEX5Ce9jm098tYwxxan4a3Kjc2PsirRc_dI=0FB810C1";
    const issueKey=key;

    try {
     const commentUrl = `${jiraApi}/${issueKey}/comment`;
      const commentMessage={
        body: {
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: req.body.comment,
                },
              ],
            },
          ],
        },
      }
   
      console.log("hyyy1");
      const commentResponse = await axios.post(commentUrl, commentMessage, {
        headers: {
          Authorization: `Basic ${Buffer.from(`thakurms7983@gmail.com:${token}`).toString('base64')}`,
          'Content-Type': 'application/json',
        },
      });
      console.log("hyyy3");
      console.log(commentResponse);
      res.status(200).json({ message: 'comment added successfully.', response: commentResponse.statusText });
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: 'An error occurred.' });
    }
  })

  // task 3 database data get krna 
app.get('/getTickets', (req, res) => {
  const query = 'SELECT * FROM jira ORDER BY number DESC'; 
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching saved tickets:', err);
      res.status(500).send('An error occurred');
    } else {
      res.json(results);
    }
  });
});


// function showPersons(){
 
//   let sql="DELETE  FROM jira";
//   db.query(sql,function(err,result){
//       if(err) console.log("error  in database",err.message);
//       else console.log(result);
//   })
// }

// showPersons();
