import React, { Component } from 'react'
import httpServices from '../services/httpServices';
import TableRow from './tableRow';

export default class JiraApiCall extends Component {
    state={
        tickets:[],
        comment:'',
    }
    async fetchData(){
        try {
            let response = await httpServices.get('/fetchTickets'); 
            console.log('Tickets fetched and database save:', response.data);
            // this.setState({ tickets: response.data });
          } catch (error) {
            console.error('Error fetching tickets:', error);
          }
    }
    async fetchData1(){
        try {
            let response = await httpServices.get('/getTickets'); 
            console.log('Tickets fetched:', response.data);
            this.setState({ tickets: response.data });
          } catch (error) {
            console.error('Error fetching tickets:', error);
          }
    }

   async componentDidMount() {
try {
 await this.fetchData1();
 await this.fetchData();
} catch (error) {
  console.error('Error:', error);
}
      }

      componentDidUpdate(prevProps, prevState) {
        if (prevProps !== this.props) this.fetchData1();
        if (prevProps !== this.props) this.fetchData(); 
      }

      handleRefersh=()=>{
        this.fetchData1();
        this.fetchData();
      }

  render() {
    const {tickets,comment}=this.state
    return (
      <div className="container">
        <div className="row bg-dark text-white ml-1">
            <div className="col-1 text-center">Number</div>
            <div className="col-2 text-center">Name</div>
            <div className="col-2  text-center">Description</div>
            <div className="col-1 text-center">Reporter</div>
            <div className="col-1 text-center">Status</div>
            <div className="col-1 text-center">Due Date</div>
            <div className="col-1 text-center"></div>
            <div className="col-3"></div>
        </div>
        {tickets.map((n) => (
                   <TableRow n={n} key={n.Number}  /> 
))}

<button className='btn btn-primary mt-2' onClick={this.handleRefersh}>Fetch Tickets</button>
      </div>
    )
  }
}
