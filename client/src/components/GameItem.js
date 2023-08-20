import React, {useState} from "react";
import { Button,Container, Row, Col, Form, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GrLogout } from "react-icons/gr";

const GameItem = props => {

    const baseURL = 'http://localhost:3001/api';
    const [isEditable, setIsEditable] = useState(false);
    const [gameName, setGameName] = useState(props.game.gameName);
    const [gamePrice, setGamePrice] = useState(props.game.gamePrice);
    const [gameDescription,setGameDescription] = useState(props.game.gameDescription);
    const [gameImage,setGameImage] = useState(props.game.gameImage);
    const [gameBackgroundImage,setGameBackgroundImage] = useState(props.game.gameBackgroundImage);

    const updateGame = async() => {

        console.log(props);
        const response = await fetch(baseURL + "/updateGame/" + props.game._id, {
            method: 'PUT',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({
                gameName: gameName,
                gamePrice: gamePrice,
                isAvailable: props.game.isAvailable,
                genreId: props.game.genreId,
                gameDescription: gameDescription,
                gameImage: gameImage,
                gameBackgroundImage:gameBackgroundImage
            })
          });
          const data = await response.json();
          setIsEditable(false);
          props.loadAllGames();
    }

    return (
       <>
        {
            isEditable ? (
                <>
                 <Card style={{marginTop:12}}>
                    <div style={{overflow:'hidden', width:'100%', height:250}}>
                        <Card.Img variant="top" src={props.game.gameImage} />
                    </div>
                <Card.Body>

                    <Form.Control type="text" value={gameName} onChange={(e) => {setGameName(e.target.value)}} />
                    <Form.Control style={{marginTop:6}} type="text" value={gamePrice} onChange={(e) => {setGamePrice(e.target.value)}} />
                    <Form.Control style={{marginTop:6}} type="text" value={gameDescription} onChange={(e) => {setGameDescription(e.target.value)}} />
                    <Form.Control style={{marginTop:6}} type="text" value={gameImage} onChange={(e) => {setGameImage(e.target.value)}} />
                    <Form.Control style={{marginTop:6}} type="text" value={gameBackgroundImage} onChange={(e) => {setGameBackgroundImage(e.target.value)}} />

                    <Container style={{marginTop:8}}>
                        <Row>
                            <Col>
                                <Button variant="info" onClick={() => setIsEditable(!isEditable)}>Back</Button>
                            </Col>
                            <Col>
                                <Button variant="success" onClick={updateGame}>Save</Button>
                            </Col>
                        </Row>
                    </Container>
                </Card.Body>
                </Card>
                </>
            ) : (
                <>
                 <Card style={{marginTop:12}}>
                    <div style={{overflow:'hidden', width:'100%', height:290}}>
                        <Card.Img variant="top" src={props.game.gameImage} />
                    </div>
                <Card.Body>
                    <Card.Title style={{fontSize:15}}><br/>{props.game.gameName}</Card.Title>
                    <Card.Text style={{fontWeight:400}}>Genre: {props.game.genreId.genreName}</Card.Text>
                    <Card.Text><b style={{fontSize:24}}>₪{props.game.gamePrice}</b></Card.Text>
                    <Container>
                        <Row>  
                            <Button variant="info" onClick={() => setIsEditable(!isEditable)}>Edit</Button>
                        </Row>
                    </Container>
                </Card.Body>
                </Card>
                </>
            )
        }
       </>
    )
}

export default GameItem;