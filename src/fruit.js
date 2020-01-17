import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import { Link } from "react-router-dom";
import axios from 'axios'
import nano from 'nano'
import { Modal, ModalHeader, ModalBody, ModalFooter, Table, Button, FormGroup, Input, Label } from 'reactstrap'
export default class fruit extends Component {
    constructor() {
        super();
        this.state = {
            fruits: [],
            tastesDetails: [],
            shapeDetails: [],
            newFruitModal: false,
            editFruitModal: false,
            detailsModal: false,
            newFruitData: {
                id: '',
                color: '',
                tastes: [
                    ""
                ],
                shape: ""

            },
            editFruitData: {
                id: '',
                color: '',
                tastes: [
                    ""
                ],
                shape: "",
                rev: ''

            }
        };
        fetch('http://localhost:5984/fruit/_all_docs?include_docs=true')
            .then(res => res.json())
            .then(data => {
                this.setState({ fruits: data.rows });
            }).catch(ex => {
                console.log(ex);
            });

            fetch('http://localhost:5984/fruit/_design/viewFruitWithcountshape/_view/viewFruitWithcountshape?reduce=true&group=true')
            .then(res => res.json())
            .then(data => {
                this.setState({ tastesDetails: data.rows });
            }).catch(ex => {
                console.log(ex);
            });
            fetch('http://localhost:5984/fruit/_design/viewFruitWithCounttastes/_view/viewFruitWithCounttastes?reduce=true&group=true')
            .then(res => res.json())
            .then(data => {
                this.setState({ shapeDetails: data.rows });
            }).catch(ex => {
                console.log(ex);
            });
    }

    // componentDidUpdate() {
    //     fetch('http://localhost:5984/fruit/_all_docs?include_docs=true')
    //         .then(res => res.json())
    //         .then(data => {
    //             this.setState({ fruits: data.rows });
    //         }).catch(ex => {
    //             console.log(ex);
    //         })

    // }
    toggleNewFruit() {
        this.setState({
            newFruitModal: !this.state.newFruitModal
        })

    }
    toggleEditFruit() {
        this.setState({
            editFruitModal: !this.state.editFruitModal
        })

    }
    toggleDetailsModal() {
        this.setState({
        detailsModal: !this.state.detailsModal
    })
    }
    AddFruit() {
        console.log(this.state.newFruitData);
        const { id, color, tastes, shape } = this.state.newFruitData
        const nano = require('nano')('http://localhost:5984');
        nano.use('fruit').insert({ id: id, color: color, tastes: tastes, shape: shape },
            function (err, body) {
                if (!err)
                    console.log(body);
                    window.location.reload();
            });
        this.setState({
            newFruitModal: !this.state.newFruitModal
        })
    }
    editFruit(id, color, tastes, shape, rev) {

        this.setState({
            editFruitData: { id, color, tastes, shape, rev }, editFruitModal: !this.state.editFruitModal

        });
        console.log(this.state.editFruitData)
    }

    updateFruit() {
        console.log(this.state.editFruitData)
        const nano = require('nano')('http://localhost:5984');
        nano.use('fruit').insert(this.state.editFruitData, function (err, body) {
            if (!err)
                console.log(body);
                window.location.reload();
        });
        this.setState({
            editFruitModal: !this.state.editFruitModal
        })
    }

    deleteFruit = ((id, rev) => {
        console.log(id);
        const nano = require('nano')('http://localhost:5984');
        nano.use('fruit').destroy(id, rev,
            function (err, body) {
                if (!err)
                    console.log(body);

                    window.location.reload();

            });

    })

    render() {
        console.log("this.state: ");
        console.log(this.state);

        const rows = this.state.fruits.map(item => {
            const name = item.doc.id;
            const color = item.doc.color;
            const tastes = item.doc.tastes;
            const shape = item.doc.shape;
            const rev = item.value.rev;
            return (
                <tr key={item.id}>
                    <td>{name}</td>
                    <td>{color}</td>
                    <td>{tastes}</td>
                    <td>{shape}</td>

                    <td>

                        <Button className="btn btn-primary" onClick={this.editFruit.bind(this, name, color, tastes, shape, rev)} >Edit </Button>|
                    <button className="btn btn-danger" onClick={this.deleteFruit.bind(this, item.id, item.value.rev)}>Delete</button>
                    </td>
                </tr>
            )
        })

        
        const rowsCountTastesDetails = this.state.tastesDetails.map(item => {
            const name = item.key;
            const Count = item.value;
            return (
                <tr key={item.key}>
                    <td>{name}</td>
                    <td>{Count}</td>
                </tr>
            )
        })
        const rowsCountShapeDetails = this.state.shapeDetails.map(item => {
            const name = item.key;
            const Count = item.value;
           
            return (
                <tr key={item.key}>
                    <td>{name}</td>
                    <td>{Count}</td>
                </tr>
            )
            
        })
        console.log(rowsCountShapeDetails);
        return (
            <div className="container">
                <span id='headerText'>List of Fruit</span>

                {/* /////////////////////////////////////////////
              /////  Update Modal
              //////////////////////////////////////////// */}
                <Modal isOpen={this.state.editFruitModal} toggle={this.toggleEditFruit.bind(this)}>
                    <ModalHeader toggle={this.toggleEditFruit.bind(this)}>Edit fruit</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="id">Name :</Label>
                            <Input id="id" value={this.state.editFruitData.id} onChange={(e) => {
                                let { editFruitData } = this.state;
                                editFruitData.id = e.target.value
                                this.setState({
                                    editFruitData
                                })
                            }} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="color">color :</Label>
                            <Input id="color" value={this.state.editFruitData.color} onChange={(e) => {
                                let { editFruitData } = this.state;
                                editFruitData.color = e.target.value
                                this.setState({
                                    editFruitData
                                })
                            }} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="tastes">tastes :</Label>
                            <Input id="tastes" value={this.state.editFruitData.tastes} onChange={(e) => {
                                let { editFruitData } = this.state;
                                editFruitData.tastes = e.target.value
                                this.setState({
                                    editFruitData
                                })
                            }} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="shape">shape :</Label>
                            <Input id="shape" value={this.state.editFruitData.shape} onChange={(e) => {
                                let { editFruitData } = this.state;
                                editFruitData.shape = e.target.value
                                this.setState({
                                    editFruitData
                                })
                            }} />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.updateFruit.bind(this)}>Update</Button>{' '}
                        <Button color="secondary" onClick={this.toggleEditFruit.bind(this)} >Cancel</Button>
                    </ModalFooter>
                </Modal>

                {/* /////////////////////////////////////////////
              /////  Add Modal
              //////////////////////////////////////////// */}
                 
                <Button id='Createbtn' color="primary" onClick={this.toggleNewFruit.bind(this)}>Add Fruit</Button>
                <Button id='Detailsbtn' color="primary" onClick={this.toggleDetailsModal.bind(this)}>Show Details</Button>
                <Modal isOpen={this.state.newFruitModal} toggle={this.toggleNewFruit.bind(this)}>
                    <ModalHeader toggle={this.toggleNewFruit.bind(this)}>Add a new fruit</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="id">Name :</Label>
                            <Input id="id" value={this.state.newFruitData.id} onChange={(e) => {
                                let { newFruitData } = this.state;
                                newFruitData.id = e.target.value
                                this.setState({
                                    newFruitData
                                })
                            }} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="color">color :</Label>
                            <Input id="color" value={this.state.newFruitData.color} onChange={(e) => {
                                let { newFruitData } = this.state;
                                newFruitData.color = e.target.value
                                this.setState({
                                    newFruitData
                                })
                            }} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="tastes">tastes :</Label>
                            <Input id="tastes" value={this.state.newFruitData.tastes} onChange={(e) => {
                                let { newFruitData } = this.state;
                                newFruitData.tastes[0] = e.target.value
                                this.setState({
                                    newFruitData
                                })
                            }} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="shape">shape :</Label>
                            <Input id="shape" value={this.state.newFruitData.shape} onChange={(e) => {
                                let { newFruitData } = this.state;
                                newFruitData.shape = e.target.value
                                this.setState({
                                    newFruitData
                                })
                            }} />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.AddFruit.bind(this)}>Add</Button>{' '}
                        <Button color="secondary" onClick={this.toggleNewFruit.bind(this)} >Cancel</Button>
                    </ModalFooter>
                </Modal>


                <Modal isOpen={this.state.detailsModal} toggle={this.toggleDetailsModal.bind(this)}>
                    <ModalHeader toggle={this.toggleDetailsModal.bind(this)}>Details</ModalHeader>
                    <ModalBody>
                    <h3>Tastes Count</h3>
                                <Table>
                                    <thead>
                                        <th>tastes</th>
                                        <th>Count</th>
                                    </thead>
                                    <tbody>
                                         {rowsCountTastesDetails}
                                    </tbody>
                                </Table>
                                <h3>Shape Count</h3>
                                <Table>
                                    <thead>
                                        <th>shape</th>
                                        <th>Count</th>
                                    </thead>
                                    <tbody>
                                         {rowsCountShapeDetails}
                                    </tbody>
                                </Table>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggleDetailsModal.bind(this)} >Cancel</Button>
                    </ModalFooter>
                </Modal>


                {/* <Link id='createbtn' class = "btn btn-success" to={'./Create'}>Create new item</Link> */}

                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col-md-2">Fruit name</th>
                            <th scope="col-md-2">Color </th>
                            <th scope="col-md-2">tastes</th>
                            <th scope="col-md-2">shape </th>
                            <th scope="col-md-2">Action </th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>

            </div>
        )

    }
}