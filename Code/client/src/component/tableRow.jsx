import React, { Component } from 'react'
import httpServices from '../services/httpServices';
import {FaPlus} from 'react-icons/fa'

export default class TableRow extends Component {
    state = {
      formData:{comment: "",transitionID:""},
     tickets:[
      // {value:2,display:"Open Ticket"},
      {value:4,display:"Close Ticket"},
     ]
    };

    async postData(url, obj) {
         try {
            let response = await httpServices.post(url, obj);
        console.log(response.data.message);
      } catch (error) {
        console.error('Error closing ticket:', error);
      }
    }
  
    handleCommentChange = (event) => {
        const {currentTarget:input}=event;
        let s1={...this.state}
        s1.formData[input.name]=input.value
      this.setState(s1);
    };
  
    handleFormSubmit = (number) => {
      const { formData } = this.state;
      const {comment,transitionID}=this.state.formData

      console.log(comment);
      if (comment.trim() === "" || transitionID.trim()==="") {
        alert("Please enter a comment.");
        return;
      }

      this.postData(`/closeIssue/${number}`,formData)
      this.setState({ formData:{comment:""} }); 
    };
  
    render() {
      const { n } = this.props;
      const {comment,transitionID}=this.state.formData
      const {tickets}=this.state;
      return (
        <div className="row bg-light mb-1" key={n.Number} >
        <div className="col-1 text-center">{n.Number}</div>
        <div className="col-2 text-center">{n.Name}</div>
        <div className="col-2 text-center">{n.Description}</div>
        <div className="col-1 text-center">{n.Reporter}</div>
        <div className="col-1 text-center" style={{ color: n.Status === 'Done' ? 'red' : 'black' }}>
          <span  >{n.Status}</span></div>
        <div className="col-1 text-center">{n.DueDate ? n.DueDate :"none"}</div>
        <div className="col-1">
        {(n.Status === "To Do" || n.Status === "Progress") && (
        <div className='from-group'>
        <select className='form-control' name="transitionID" value={transitionID} onChange={this.handleCommentChange}>
            <option  value="">Select your Status</option>
            {tickets.map((c1)=>(
                <option value={c1.value}>{c1.display}</option>
            ))}
        </select>
     
        </div>
           )}
        </div>
        <div className="col-3 text-center">
            {(n.Status === "To Do" || n.Status === "Progress") && (
                <form className="d-flex align-items-center">
                    <input type="text" name="comment" id="comment" className="form-control mr-2"  value={comment}
                    placeholder='add a comment...'    onChange={this.handleCommentChange} />
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => this.handleFormSubmit(n.Number)}
                    >
                       {/* <FaPlus color='red' />  */}
                       ChangeStatus
                    </button>
                </form>
           )}
        </div>
    </div>
      );
    }
  }
