import React, { Component } from 'react';
import './App.css';

class App extends Component
{
	componentWillMount()
	{
		window.socketAddress = "http://localhost:8080";
	}

	//tell the grid that
	onHeaderClick = (event, newAction, newStatus) =>
	{
		//alert('parent: ' + newAction);

		this.refs.gridView.refreshGridView(newAction, newStatus);
	}

	render()
	{
		return(
			<div className="App">
				<div className="Container">
					<Header action="selectJobs" status="new" onClick={this.onHeaderClick} />
					<GridView action="selectJobs" status="new" ref="gridView" />
				</div>
			</div>
		);
	}
}

class Header extends Component
{
	constructor(props)
	{
		super(props);

		this.state =
		{
			action: props.action,
			status: props.status
		};
	}

	clickSelectorButton = (event) =>
	{
		//alert(event.target.getAttribute('button-action'));

		var newAction = event.target.getAttribute('button-action');
		var newStatus = event.target.getAttribute('button-status');

		this.setState({ action: newAction, status: newStatus });

		if (this.props.onClick)
			this.props.onClick(event, newAction, newStatus);
	};

	render()
	{
		//change the buttons depending on the currently selected action
		if (this.state.status === 'new')
		{
			return(
				<div className="ButtonHeader">
					<div
						className="SelectorButton SelectorButtonActive SelectorButtonLeft"
						button-action="selectJobs"
						button-status="new"
					>Invited</div>
					<div
						className="SelectorButton SelectorButtonInactive"
						button-action="selectJobs"
						button-status="accepted"
						onClick={this.clickSelectorButton}
					>Accepted</div>
				</div>
			);
		}
		else
		{
			return(
				<div className="ButtonHeader">
					<div
						className="SelectorButton SelectorButtonInactive SelectorButtonLeft"
						button-action="selectJobs"
						button-status="new"
						onClick={this.clickSelectorButton}
					>Invited</div>
					<div
						className="SelectorButton SelectorButtonActive"
						button-action="selectJobs"
						button-status="accepted"
					>Accepted</div>
				</div>
			);
		}
	}
}

class GridViewRow extends Component
{
	render()
	{
		var item = this.props;
		var initial = item.contact_name.charAt(0).toUpperCase();

		//the appearance of the grid row depends on the status of the item
		if (item.status === 'new')
		{
			return (
			<div className="GridViewRow">
				<table>
				<tbody>
				<tr>
					<td rowSpan="2"><div className="GridViewRowCircle">{initial}</div></td>
					<td><p className="GridViewRowBold">{item.contact_name}</p></td>
				</tr>
				<tr>
					<td><p>{item.created_at_longformat}</p></td>
				</tr>
				</tbody>
				</table>
				<hr />
                        	<span className="GridViewFloatLeft GridViewMargin1"><i className="fas fa-map-marker-alt"></i>{item.suburb} {item.postcode}</span>
                        	<span className="GridViewFloatLeft GridViewMargin1"><i className="fas fa-briefcase"></i>{item.category}</span>
                        	<span className="GridViewFloatLeft GridViewMargin1">Job ID: {item.record_id}</span>
                        	<hr className="GridViewRowClear" />
                        	<div className="GridViewDescription">{item.description}</div>
                        	<hr className="GridViewRowClear" />
				<div className="GridViewAcceptButton GridViewFloatLeft" onClick={this.clickAcceptButton}><h3>Accept</h3></div>
				<div className="GridViewDeclineButton GridViewFloatLeft" onClick={this.clickDeclineButton}><h3>Decline</h3></div>
				<h5 className="GridViewFloatLeft GridViewRowBold">${item.price}</h5>
				<h5 className="GridViewFloatLeft GridViewRowNormal">Lead Invitation</h5>
				<hr className="GridViewRowClear" />
			</div>
			);
		}
		else
		{
			return (
			<div className="GridViewRow">
				<table>
				<tbody>
				<tr>
					<td rowSpan="2"><div className="GridViewRowCircle">{initial}</div></td>
					<td><p className="GridViewRowBold">{item.contact_name}</p></td>
				</tr>
				<tr>
					<td><p>{item.created_at_longformat}</p></td>
				</tr>
				</tbody>
				</table>
				<hr />
                        	<span className="GridViewFloatLeft GridViewMargin1"><i className="fas fa-map-marker-alt"></i>{item.suburb} {item.postcode}</span>
                        	<span className="GridViewFloatLeft GridViewMargin1"><i className="fas fa-briefcase"></i>{item.category}</span>
                        	<span className="GridViewFloatLeft GridViewMargin1">Job ID: {item.record_id}</span>
                        	<span className="GridViewFloatLeft GridViewMargin1">${item.price} Lead Invitation</span>
                        	<hr className="GridViewRowClear" />
				<h4 className="GridViewFloatLeft GridViewRowBold GridViewMargin2"><i className="fas fa-phone-alt"></i><a href="tel:{item.contact_phone}">{item.contact_phone}</a></h4>
				<h4 className="GridViewFloatLeft GridViewRowBold GridViewMargin2"><i className="far fa-envelope"></i><a href="mailto:{item.contact_email}">{item.contact_email}</a></h4>
                        	<div className="GridViewDescription GridViewRowClear">{item.description}</div>
			</div>
			);
		}
	}

	clickAcceptButton = (event) =>
	{
		//alert('accept clicked');
		//alert(this.props.record_id);

		fetch(window.socketAddress + "/?id=" + this.props.record_id + "&action=updateJob&status=accepted")
		.then(res => res.json())
		.then(
			(result) =>
			{
				this.props.executeQuery();
				alert("Job ID " + this.props.record_id + " has been marked as accepted.");
			},
        		(error) => { alert("An error occurred performing the action."); }
		)
	}

	clickDeclineButton = (event) =>
	{
		//alert('decline clicked');
		//alert(this.props.record_id);

		fetch(window.socketAddress + "/?id=" + this.props.record_id + "&action=updateJob&status=declined")
		.then(res => res.json())
		.then(
			(result) =>
			{
				this.props.executeQuery();
				alert("Job ID " + this.props.record_id + " has been marked as declined.");
			},
        		(error) => { alert("An error occurred performing the action."); }
		)
	}
}

class GridView extends React.Component
{
	constructor(props)
	{
		super(props);

		this.state =
		{
			error: null,
			isLoaded: false,
			items: [],
			action: props.action,
			status: props.status
		};
	}

	//updates the state information and re-issues the query
	refreshGridView = (newAction, newStatus) =>
	{
		//alert('refreshGridView: ' + newAction);

		this.setState(
		{
			error: null,
			isLoaded: false,
			items: [],
			action: newAction,
			status: newStatus
		}, () =>
		{
			this.executeQuery();
		});
	};

	//asks the server for data to populate the grid
	executeQuery = () =>
	{
		fetch(window.socketAddress + "/?action=" + this.state.action + "&status=" + this.state.status)
		.then(res => res.json())
		.then(
			(result) =>
			{
				if (result.result_code > 0)
				{
					this.setState(
					{
						isLoaded: true,
						error: {message: "An error occurred at the server."}
					});
				}
				else
				{
					this.setState(
					{
						isLoaded: true,
						items: result.result_data
					});
				}
			},

        		(error) =>
			{
				this.setState(
				{
					isLoaded: true,
					error
				});
			}
		)
	};

	componentDidMount()
	{
		this.executeQuery();
	}

	//render the results returned by the server - pass the info to the grid row
	render()
	{
		const { error, isLoaded, items } = this.state;

		if (error)
			return <div className="ErrorBox">An error occurred: {error.message}</div>;
		else if (!isLoaded)
			return <div className="NeutralBox">Please wait, loading...</div>;
		else if (items.length === 0)
			return <div className="NeutralBox">Your search didn't return any results.</div>;

		return (
		<div>
		{
			items.map(item => (
				<GridViewRow
					key={item.id}
					executeQuery={this.executeQuery}
					record_id={item.id}
					status={item.status}
					category={item.category}
					suburb={item.suburb}
					postcode={item.postcode}
					contact_name={item.contact_name}
					contact_phone={item.contact_phone}
					contact_email={item.contact_email}
					price={item.price}
					description={item.description}
					created_at={item.created_at}
					created_at_longformat={item.created_at}
					updated_at={item.updated_at}
				/>
			))

		}
		</div>
		);
	}
}

export default App;
