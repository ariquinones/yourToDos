// es5, 6, and 7 polyfills, powered by babel
import polyfill from "babel-polyfill"

//
// fetch method, returns es6 promises
// if you uncomment 'universal-utils' below, you can comment out this line
import fetch from "isomorphic-fetch"

// universal utils: cache, fetch, store, resource, fetcher, router, vdom, etc
// import * as u from 'universal-utils'

// the following line, if uncommented, will enable browserify to push
// a changed fn to you, with source maps (reverse map from compiled
// code line # to source code line #), in realtime via websockets
// -- browserify-hmr having install issues right now
// if (module.hot) {
//     module.hot.accept()
//     module.hot.dispose(() => {
//         app()
//     })
// }

// Check for ServiceWorker support before trying to install it
// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('./serviceworker.js').then(() => {
//         // Registration was successful
//         console.info('registration success')
//     }).catch(() => {
//         console.error('registration failed')
//             // Registration failed
//     })
// } else {
//     // No ServiceWorker Support
// }

import DOM from 'react-dom'
import React, {Component} from 'react'
import _ from 'underscore'
import Backbone from 'backbone'

function app() {
    // start app
    // new Router()
    // contentEditable 
    

    var ListView = React.createClass({
    	_addItem: function(name) {
			return (
				this.state.toDoListCollection.add(new ToDoModel(name)),	
	            this._update()
            )
    	},
    	_removeItem: function(model) {
    		this.state.toDoListCollection.remove(model),
    		this._update()
    	},
    	_generateButtons: function() {
    		var buttons = ["Done","Not Done", "All"].map(function(status) {
    			return <button onClick={this._filterView} value={status} className="navButton">{status}</button>  
    			}.bind(this))			
    			return buttons
    	},
    	_filterView: function(event) {
    		var buttonView = event.target.value
            location.hash= event.target.value   
    		this.setState ({
    			viewType: buttonView
    		})
    	},
        _update: function(updatedModel) {
            this.setState ({
                toDoListCollection: this.state.toDoListCollection
            })
        }, 
        _today: function() {
            var today = new Date().toString().substr(0,15)
            return today 
        },
    	render: function() {
            var toDoListCollection = this.state.toDoListCollection
            if (this.state.viewType === "Done") toDoListCollection = toDoListCollection.where({done: true})
            if (this.state.viewType === "Not Done") toDoListCollection = toDoListCollection.where({done: false})
    		return (
    			<div className="toDoListView">
                    <div className="date">{this._today()}</div>
    				<AddToDoItem _addItem={this._addItem} />
                    <div className="navButtonContainer">{this._generateButtons()}</div>
    				<ListOfAllItems _removeItem={this._removeItem} _update={this._update} toDoListCollection={toDoListCollection}  />
    			</div>
    		)
    	},
    	getInitialState: function() {
    		return {
    			toDoListCollection: this.props.toDoListCollection,
    			viewType: "all"
    		}
    	}
    })

    var AddToDoItem = React.createClass({
    	_handleKeyPress: function(keydown) {
    		if (keydown.keyCode ===13) {
    			var itemToAdd = keydown.target.value
    			keydown.target.value = ''
    			this.props._addItem(itemToAdd)
    		}
    	},
    	_handleClick: function () {
    		var itemToAdd = document.querySelector('.addToDoItem').value
    		console.log(itemToAdd)
    		this.props._addItem(itemToAdd)
    	},
    	render: function() {
    		return (
    				<div className="addTask">
    					<input placeholder="NEW TASK..." className="addToDoItem" onKeyDown={this._handleKeyPress} />
    					<button onClick={this._handleClick} className="addButton">  + ADD  </button>
    				</div>
    			)
    	}
    })
    var ListOfAllItems = React.createClass({
        _makeEachItem: function(model, i) {
    			return (                    
                        <ToDoItem  key={i} _removeItem={this.props._removeItem} _update={this.props._update} itemModel={model}/>
    				)
    	},
    	render: function() {
    		return (
    				<div className="listOfAllItems">
                         {<div className="menu"><span>Due Date</span><span>Task/Description</span><span>Status</span><span>Delete</span></div>}
    					{this.props.toDoListCollection.map(this._makeEachItem)}
    				</div>
    			)
    	}
    })


    var ToDoItem = React.createClass({
    	_handleStatus: function() {
            if (this.props.itemModel.get('done')) {
                this.props.itemModel.set({done: false})
                this.props.itemModel.set({selected: false})
            }
            else {
                this.props.itemModel.set({done: true})
                this.props.itemModel.set({selected: true})
            }
            console.log(this.props.itemModel.attributes.done)
            this.props._update()
    	},
        _handleRemoveItem: function () {
            this.props._removeItem(this.props.itemModel)
        },
        _handleItemDescription: function(clickEvent) {
            if (clickEvent.keyCode === 13) {
                var descr = clickEvent.target.value
                // clickEvent.target.remove()
                this.props.itemModel.set({itemDescription: descr})
                this.props._update()
                }            
        },  

        _handleDueDate: function(clickEvent) {
            if (clickEvent.keyCode === 13) {
                var dueDate = clickEvent.target.value
                // clickEvent.target.remove()
                this.props.itemModel.set({itemDueDate: dueDate})
                this.props._update() 
            }
        },
    	render: function() {
            // var dueDateStyle = {}
            // var descStyle = {}
            // <input id="tryOut" type="text" style={dueDateStyle} placeholder="Add due date..." onKeyDown={this._handleDueDate}/>
            //  <input id="tryOut" type="text" style={descStyle} placeholder="Add description..." onKeyDown={this._handleItemDescription}/>
            var inputDescription = <span></span>
            var inputDueDate = <span></span>
            if (this.props.itemModel.attributes.itemDescription === null) {
                // descStyle.color = "#247BA0"
                // descStyle.opacity = ".7"
                inputDescription = <input className="inputBox" type="text" placeholder="Add description" onKeyDown={this._handleItemDescription}/>
            }
            if (this.props.itemModel.attributes.itemDueDate === null) {
                // dueDateStyle.color = "#247BA0"
                inputDueDate = <input className="inputBox" type="text"  placeholder="Add due date" onKeyDown={this._handleDueDate}/> 
            }
    		return (
    				<div className="toDoItem">
                        <div className="dueDateContainer">
                            {inputDueDate}
                            <span>{this.props.itemModel.get('itemDueDate')}</span>
                        </div>
                        <div className="itemNameandDescriptionContainer">
                            <span className="taskName"> {this.props.itemModel.get('name')} </span>
                            
                                {inputDescription}
                                <p className="itemDescription"> {this.props.itemModel.get('itemDescription')}</p>
                            
                        </div>
                        <div id="itemStatus">
                            <label className="label toggle">
                                <input type="checkbox" checked={this.props.itemModel.get('selected')} className="doneCheckbox" onClick={this._handleStatus}/>
                                <div className="toggle_control"></div>
                            </label>
                        </div>
                        <button onClick={this._handleRemoveItem}><i className="material-icons">delete_forever</i></button>
    				</div> 
    			)
    	   }
    })


    var ToDoModel = Backbone.Model.extend({
    	defaults: {
    		done: false,
            itemDescription: null,
            itemDueDate: null,
            selected: false
    	},
    	initialize: function(nameOfToDoItem) {
    		this.set({
    			name: nameOfToDoItem
    		})
    	}
    })

    var ToDoCollection = Backbone.Collection.extend({
    	model: ToDoModel
    })

    var ToDoRouter = Backbone.Router.extend({
    	routes: {
    		"*default": "handleReactView"
    	},
    	handleReactView: function() {
    		DOM.render(<ListView toDoListCollection={new ToDoCollection()} />, document.querySelector('.container'))
    	},
    	initialize: function () {
    		Backbone.history.start()
    	}
    })

    var newRtr = new ToDoRouter()

}

app()