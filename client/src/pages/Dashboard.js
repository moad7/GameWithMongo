import React, { useState, useEffect } from "react";
import { Button, Container, Row, Col, Table,Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CardGame from "../components/CardGame.js";
import { useNavigate } from 'react-router-dom';

const Dashboard = props => {

    const baseURL = "http://localhost:3001/api";


    const [selectedGenre, setselectedGenre] = useState("");
    const [selectedGameName, setselectedGameName] = useState("");
    const [selectedGameId, setselectedGameId] = useState("");

    const [selectedGamePrice, setselectedGamePrice] = useState("");
    const [selectedGameDescription, setselectedGameDescription] = useState("");
    const [selectedGameBackgroundImage, setselectedGameBackgroundImage] = useState("");
    const [genreName, setGenreName] = useState("");
    const [genreDescription, setGenreDescription] = useState("");
    const [isAvailable,setIsAvailable]=useState(true);




    const[sumPrice,setSumPrice]=useState(0);
    const [games, setAllGames] = useState([]);
    const [gamesByGenre, setGamesByGenre] = useState([]);
    const [ganres, setAllGanres] = useState([]);
    const [searchGameByName, setSearchGameByName] = useState('');
    const [onClickSerch, setOnClickSerch] = useState("searchAllGame");
    const [selectedGame, setSelectedGame] = useState(null);
    const [authView, setAuthView] = useState("Dashboard")
    const [gameName, setGameName] = useState("");
    const [authViewAdmin, setAuthViewAdmin] = useState("CreateGame");

    const [arrayGameCart, setArrayGameCart] = useState([]);

    function addGameToCart(game) {
        console.log(arrayGameCart);
        const existingItem = arrayGameCart.find(item => item._id.toString() === game._id.toString());
        if (existingItem) {
            toast.warning('Hes Game Was Added Before Cart!!');
        } else {

            setArrayGameCart(prevArray => [...prevArray, game]);
            toast.success(`Added ${game.gameName} to Cart successfully`)
        }

    }
    const deleteRowFromList = (tid) =>{
        console.log(tid);
        setArrayGameCart((state)=>state.filter((item)=> item._id !=tid));
    }
    // if(arrayGameCart.length>0){
    //     const total = arrayGameCart.gamePrice.reduce((acc, cur) => acc + parseInt(cur, 10), 0);

    //     setSumPrice(total);
    // }
    const loadAllGames = async () => {
        const response = await fetch(baseURL + '/readAllGames', {
            method: 'GET'
        });
        const data = await response.json();
        setAllGames(data.message);
    }


    const loadGenres = async () => {
        const response = await fetch(baseURL + '/readAllGenres', {
            method: 'GET'
        });
        const data = await response.json();
        setAllGanres(data.message);

    }

    useEffect(() => {
        loadAllGames();
        loadGenres();
        calculateSum();
        if (gameName == "") {
            setOnClickSerch("searchAllGame");
        }
        
    }, [gameName,arrayGameCart]);

    const Search = (Name) => {
        setSearchGameByName(Name);
        setOnClickSerch("searchGameByName");
    }

    const showGame = (game) => {
        setAuthView("ViewGame");
        setSelectedGame(game);
        window.location.hash = "idPageGame";
    }

    const navigate = useNavigate();
    const Logout = () => {
        navigate('/');
    }

    const addNewGame = async () => {
        if (selectedGameName !== "" && selectedGamePrice !== "") {
            const response = await fetch(baseURL + '/createGame', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    genreId: selectedGenre,
                    gameName: selectedGameName,
                    gamePrice: selectedGamePrice,
                    gameDescription: selectedGameDescription,
                    gameBackgroundImage:selectedGameBackgroundImage
                })
            });


            const data = await response.json();
            toast.success(`${data.message.gameName} created `)
            loadAllGames();
            setselectedGameName('');
            setselectedGamePrice('');
            setselectedGameDescription('');
            setselectedGameBackgroundImage('');
        } else {
            toast.error("Game name and price is require !!")
        }
    }

    const addNewGenre = async () => {
        if (genreName !== "") {
            const response = await fetch(baseURL + '/createGenre', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    genreName: genreName,
                    genreDescription: genreDescription,
                })
            });
            const data = await response.json();
            loadGenres();
            toast.success(`Genre ${data.message.genreName} was created `)
            setGenreName('');
            setGenreDescription('');

        } else {
            toast.error("The inputs are require !!!")
        }
    }

    const FuncGame=(game)=>{
        // if(authViewAdmin=='CreateNewGame'){
            // setselectedGameName('');
            // setselectedGamePrice('');
            // setselectedGameDescription('');
            // setselectedGameBackgroundImage('');
        // }else{

        setIsAvailable(game.isAvailable)
        setselectedGameName(game.gameName);
        setselectedGameId(game._id);
        setselectedGenre(game.genreId);
        setselectedGamePrice(game.gamePrice);
        setselectedGameDescription(game.gameDescription);
        setselectedGameBackgroundImage(game.gameBackgroundImage);
    }
    const updateGame = async() => {

        console.log(props);
        const response = await fetch(baseURL + "/updateGame/" + selectedGameId, {
            method: 'PUT',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({
                gameName: selectedGameName,
                gamePrice: selectedGamePrice,
                isAvailable:isAvailable,
                genreId:selectedGenre,
                gameDescription:selectedGameDescription,
                gameBackgroundImage:selectedGameBackgroundImage
            })
          });
          const data = await response.json();
          toast.success(`Game ${data.message.gameName} was Updated`)
          loadAllGames();
          setselectedGameName('');
          setselectedGamePrice('');
          setselectedGameDescription('');
          setselectedGameBackgroundImage('');
    }
        
    const AdminCreateGame =()=>{
        setselectedGameName('');
        setselectedGamePrice('');
        setselectedGameDescription('');
        setselectedGameBackgroundImage('');
        setAuthViewAdmin("CreateGame")

    }

    const deleteGameById = async(gid) =>{
        console.log(gid);
        if(gid!=""){
            try{
                const response = await fetch(baseURL + '/deleteGame/' + gid , {
                    method:'DELETE'
                });
                const data = await response.json();
                toast.success(data.message);
                loadAllGames();
                setselectedGameName('');
                setselectedGamePrice('');
                setselectedGameId('');
                setselectedGenre('');
                setselectedGameDescription('');
                setselectedGameBackgroundImage('');
            }
            catch(error)
            {
                toast.error(error.message);
            }
        }else{
            toast.warning("Choose a game to delete!!")
        }

    }
    const viewCart =()=>{
        setAuthView("Cart");
        calculateSum();
    }
    const calculateSum = () => {
        const prices = arrayGameCart.map(game => {
            if (game.gamePrice === "Free") {
              return 0; // Treat "Free" as zero
            }
            return parseFloat(game.gamePrice, 10);
        });
          const sum = prices.reduce((total, price) => total + price, 0);

        setSumPrice(sum);
    };

    const BuyGame =()=>{
        setArrayGameCart([]);
        const emoji = "\u{1F60D}"; 
        toast.success(`Thanks For Your Purchase ${emoji}  \u{1F496}`)
    }

    return (

        <>

            <Container fluid >
                <ToastContainer />
                <Row style={{ background: '#000000', paddingTop: 20, paddingBottom: 20 }}>
                    <Col xl={2}>
                        <img src="../../Shope.jpg" style={{ width: 170 }} id="Dashboard" />
                    </Col>
                    <Col style={{ padding: 12 }} xl={9}>
                        <Button variant="outline-light" style={{ marginRight: 40 }} onClick={() => { setAuthView("Admin") }}>Admin</Button>
                        <Button variant="outline-info" style={{ marginRight: 10 }} onClick={() => { setAuthView("Dashboard") }} >Home</Button>
                        <Button variant="outline-info" onClick={viewCart}>Cart</Button>

                    </Col>
                    <Col style={{ padding: 12 }}>
                        <Button variant="danger" onClick={() => { Logout() }}>LogOut</Button>
                    </Col>
                </Row>
                {
                    authView === "Dashboard" ? (
                        <>
                            <Row style={{ paddingTop: 20, paddingBottom: 20 }} className="justify-content-md-center" >
                                <Row style={{ padding: 20, borderRadius: 5, marginBottom: 20, background: "#213363", width: "35%" }} className="justify-content-md-center">

                                    <Col xl={8} style={{ marginTop: 10 }}>
                                        <div class="group1">
                                            <svg class="icon1" aria-hidden="true" viewBox="0 0 24 24">
                                                <g>
                                                    <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                                                </g>
                                            </svg>
                                            <input style={{ width: "100%" }} value={gameName} onChange={(e) => { setGameName(e.target.value) }} type="text" placeholder="Search Game Name" class="input1" />
                                        </div>
                                    </Col>
                                    <Col xl={4}>
                                        <Button onClick={() => { Search(gameName) }} variant="dark" style={{ width: '100%', height: 50 }}>Search</Button>
                                    </Col>


                                </Row>
                                <div style={{ height: 800, width: '100%' }}>
                                    <Row className="justify-content-md-center" style={{ marginTop: 60 }} xl={6}>
                                        {
                                            onClickSerch == "searchAllGame" ?
                                                (<>{
                                                    games.length > 0 && (<>
                                                        {

                                                            games.map((game) => (
                                                                <CardGame game={game} onClick={() => { showGame(game) }} addGameToCart={() => { addGameToCart(game) }} />
                                                            ))
                                                        }
                                                    </>)
                                                }</>)
                                                : onClickSerch == "searchGameByName" ? (
                                                    <>
                                                        {
                                                            games.length > 0 ? (<>
                                                                {
                                                                    games.filter((game) => {
                                                                        return game.gameName.toLowerCase().includes(searchGameByName.toLowerCase());
                                                                    }).map((item) => (
                                                                        <CardGame game={item} onClick={() => { showGame(item) }} addGameToCart={() => { addGameToCart(item) }} />
                                                                    ))
                                                                }
                                                            </>) : (<><p style={{ color: "#fff" }}>No Have Game By This Name</p></>)
                                                        }
                                                    </>)
                                                    :
                                                    (<><p style={{ color: "#fff" }}>No Have Game</p></>)

                                        }
                                    </Row>
                                </div>
                            </Row>

                        </>)

                        : authView == "Cart" ? (<>
                            {
                                arrayGameCart.length > 0 ? (<>
                                    <Row className="justify-content-center">
                                        <Table style={{ width: "60%",marginTop:60 }}>

                                            <thead style={{ color: '#FF6700' }}>
                                                <tr className="text-center">
                                                    <th >Image</th>
                                                    <th>Game Id</th>
                                                    <th style={{ width: 700 }}>Name</th>
                                                    <th>Genre</th>
                                                    <th>Price</th>
                                                    <th style={{ color: '#FF6700', width: "13%" }} >Remove</th>
                                                </tr>
                                            </thead>
                                            <tbody style={{ color: "#EBEBEB" }} >
                                                {
                                                    arrayGameCart.length > 0 &&
                                                    (
                                                        <>
                                                            {
                                                                arrayGameCart.map((item) => (
                                                                    <>
                                                                        <tr className="text-center">
                                                                            <td><img style={{ height: 80, width: 120 }} src={item.gameBackgroundImage} /></td>
                                                                            <td>{item._id}</td>
                                                                            <td>{item.gameName}</td>
                                                                            <td>{item.genreId.genreName}</td>
                                                                            <td>{item.gamePrice=='Free'?<>{item.gamePrice}</>:<>₪{item.gamePrice}</>}</td>
                                                                            <td>
                                                                                <Button variant="outline-warning" onClick={() => { deleteRowFromList(item._id) }}>Remove</Button>
                                                                            </td>
                                                                        </tr>
                                                                    </>
                                                                ))
                                                            }
                                                        </>
                                                    )
                                                }
                                            </tbody>
                                        </Table>


                                    </Row>
                                    
                                </>):(<>
                                    
                                    <Row  style={{marginTop:60}}>
                                        <h3 className="text-center" style={{ color: "#fff" }}>No have game</h3>
                                    </Row>

                                </>)

                            }
                           
                            <Row className="justify-content-center" style={{marginTop:30}}>
                                {
                                    sumPrice>0&&(<>
                                        <h3 className="text-center" style={{color:'#ffff'}}>Your Total Price Is: {sumPrice}</h3>
                                        <Button onClick={BuyGame} variant="outline-light" style={{width:'15%',background:'#58BC82',marginTop:20}}>Buy It</Button>
                                    </>)
                                }
                            </Row>
                        </>)
                            : authView == "Admin" && (<>    

                                <Row xl={12} >
                                    <Row xl={4} style={{ marginTop: 60,marginBottom:30}} className="justify-content-md-center" >

                                        <div class="radio-button-container">
                                            <div class="radio-button">
                                                <input onClick={AdminCreateGame} type="radio" class="radio-button__input" id="radio1" name="radio-group" />
                                                <label class="radio-button__label" for="radio1">
                                                    <span class="radio-button__custom"></span>
                                                    Create Game
                                                </label>
                                            </div>
                                            <div class="radio-button">
                                                <input onClick={() => { setAuthViewAdmin("CreateGenre") }} type="radio" class="radio-button__input" id="radio2" name="radio-group" />
                                                <label class="radio-button__label" for="radio2">
                                                    <span class="radio-button__custom"></span>
                                                    Create Genre
                                                </label>
                                            </div>
                                            <div class="radio-button">
                                                <input onClick={() => { setAuthViewAdmin("EditGame") }} type="radio" class="radio-button__input" id="radio3" name="radio-group" />
                                                <label class="radio-button__label" for="radio3">
                                                    <span class="radio-button__custom"></span>
                                                    Edit Gmae
                                                </label>
                                            </div>
                                        </div>

                                    </Row>
                                    <Row xl={3} className="justify-content-md-center">
                                        {
                                            authViewAdmin == "CreateGame" ?
                                                (<>
                                                    <form class="form">
                                                        <Form.Select onChange={(e) => { setselectedGenre(e.target.value) }} >
                                                            <option>Open this select menu</option>
                                                            {
                                                                ganres.length > 0 &&
                                                                ganres.map((genre) => (
                                                                    <option value={genre._id}>{genre.genreName}</option>
                                                                ))
                                                            }  
                                                        </Form.Select>
                                                        <span class="input-span">
                                                            <label for="text" class="label">Game Name</label>
                                                            <input type="text" id="text" value={selectedGameName} onChange={(e) => { setselectedGameName(e.target.value) }}/></span>
                                                        <span class="input-span">
                                                            <label for="text" class="label">Game Price</label>
                                                            <input type="text" value={selectedGamePrice} onChange={(e) => { setselectedGamePrice(e.target.value) }}/></span>
                                                        <span class="input-span">
                                                            <label for="text" class="label">Game Description</label>
                                                            <input type="text" value={selectedGameDescription} onChange={(e) => { setselectedGameDescription(e.target.value) }}/></span>
                                                        <span class="input-span">
                                                            <label for="text" class="label">Game Url Image</label>
                                                            <input type="text" value={selectedGameBackgroundImage} onChange={(e) => { setselectedGameBackgroundImage(e.target.value) }}/></span>                                                        
                                                        <Button variant="outline-light" onClick={addNewGame} style={{ marginTop: 10, width: '100%',height:60 ,background:'#58BC82'}}>Add New Game</Button>

                                                    </form>
                                                </>)
                                                : authViewAdmin == "CreateGenre" ?
                                                    (<>
                                                        <form class="form">
                                                        
                                                        <span class="input-span">
                                                            <label for="text" class="label">Genre Name</label>
                                                            <input type="text" id="text" value={genreName} onChange={(e) => { setGenreName(e.target.value) }}/></span>
                                                        <span class="input-span">
                                                            <label for="text" class="label">Genre Description</label>
                                                            <input type="text" value={genreDescription} onChange={(e) => { setGenreDescription(e.target.value) }}/></span>
                                                         <Button variant="outline-light" onClick={addNewGenre} style={{ marginTop: 10, width: '100%',height:60 ,background:'#58BC82'}}>Add New Genre</Button>

                                                    </form>
                                                    </>)
                                                    : authViewAdmin == "EditGame" &&
                                                    (<>
                                                        <Col xl={2} md={3} sm={6} style={{overflow: 'hidden', overflowX: 'hidden', overflowY: 'scroll',marginTop:50,marginRight:20,height:480}}>
                                                            {
                                                                games.length>0 && 
                                                                games.map((game)=>(<>
                                                                  <Row onClick={()=>{FuncGame(game)}} xl={12} style={{background:"#feecc1",width:250,borderRadius:40,padding:15,marginTop:19,}} >
                                                                    <Col><img style={{width:200,height:150,borderRadius:20}} src={game.gameBackgroundImage} /></Col>
                                                                    <Col  style={{marginTop:15,marginLeft:16}}>
                                                                        <h5>{game.gameName}</h5>
                                                                    </Col>
                                                                 </Row>
                                                                </>))
                                                            }
                                                        </Col>
                                                        <Col >
                                                        <Button style={{marginBottom:10,marginTop:10}} onClick={()=>{deleteGameById(selectedGameId)}} variant="danger">Delete</Button>

                                                        <form class="form">
                                                        <span class="input-span">
                                                            <label for="text" class="label">Game Name</label>
                                                            <input type="text" id="text" value={selectedGameName} onChange={(e) => { setselectedGameName(e.target.value) }}/></span>
                                                        <span class="input-span">
                                                            <label for="text" class="label">Game Price</label>
                                                            <input type="text" value={selectedGamePrice} onChange={(e) => { setselectedGamePrice(e.target.value) }}/></span>
                                                        <span class="input-span">
                                                            <label for="text" class="label">Game Description</label>
                                                            <input type="text" value={selectedGameDescription} onChange={(e) => { setselectedGameDescription(e.target.value) }}/></span>
                                                        <span class="input-span">
                                                            <label for="text" class="label">Game Url Image</label>
                                                            <input type="text" value={selectedGameBackgroundImage} onChange={(e) => { setselectedGameBackgroundImage(e.target.value) }}/></span>                                                        
                                                        <Button variant="outline-light" onClick={updateGame} style={{ marginTop: 10, width: '100%',height:60 ,background:'#58BC82'}}>Update Game</Button>

                                                    </form>
                                                        </Col>
                                                    </>)

                                        }
                                    </Row>
                                </Row>

                            </>)
                }

            </Container>

        </>
    )
}

export default Dashboard;