import React, {useState, useEffect} from "react";
import { Button, Container, Row, Col, Form} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = props => {

    const baseURL = "http://localhost:3001/api";

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mobile, setMobile] = useState("");
    const [code, setCode] = useState("");
    const [pVerifyCode, setPVerifyCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [verifyPassword, setVerifyPassword] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem("token")){
            navigate('/dashboard')
        } else {
            navigate('/')
        }
    },[]);

    


    const [authView, setAuthView] = useState("loginView"); 
    //registerView //verifyView //recoverView


      const createNewAccount = async() => {
        if(firstName !== "" && lastName !== "" && email !== "" && password !== ""){
        const user = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            mobile: mobile
        }
        axios.post(baseURL + '/account/createAccount',{user})
        .then(results => {
            toast.success(results.data.message.verficationCode);
            localStorage.setItem('vdata', JSON.stringify(results.data.message.email))
            setAuthView("verifyView");
            setFirstName('');setLastName('');setPassword('');setMobile('');
        })
        .catch(error => {
            toast.error(error.response.data.message);
        })
        } else {
            toast.error("All inputs are required!!!");
        }
        }

      const login = async() => {
        if(email !== "" && password !== ""){
        const user = {
            email: email,
            password: password
        }
        axios.post(baseURL + '/account/login',{user})
        .then(results => {
            //toast.success(results.data.message);
            //console.log(results.data.message.isAdmin)
            if(results.data.message.isAdmin){
                localStorage.setItem("tokenAdmin",JSON.stringify(results.data.message));
                navigate('/admin');
                toast.success("Wellcome Back Admin :)")
            }else{
                // localStorage.setItem("token", JSON.stringify(results.data.message));
                navigate('/dashboard');
            }
            setPassword('');setEmail('');

        })
        .catch(error => {
            toast.error(error.response.data.message);
        })
        } else {
        toast.error("All inputs are required!!!");
        }
      }

      const verifyMyCode = async() => {
            if(code !== ""){
                const remail = localStorage.getItem("vdata");
                const verify = {
                    email: JSON.parse(remail),
                    verficationCode: code
                }
                axios.put(baseURL + '/account/verifyAccount',{verify})
                .then(results => {
                    toast.success(`Welcome ${results.data.message.firstName}`)
                    setAuthView("loginView")
                    setCode('');
                })
                .catch(error => {
                    toast.error(error.response.data.message);
                })
            } else {
                toast.error("You didnt type any code");
            }
      }

      const checkEmail = async() =>{
        if(email !==""){
            const user = {
                email:email
            }
            axios.put(baseURL+'/account/getEmail/'+ user.email)
            .then(results =>{
                setAuthView('passwordVerifyCode');
                setPVerifyCode(results.data.message.verficationCode);
                toast.success(`Code: ${results.data.message.verficationCode}`);
                console.log(results);
            })
            .catch(error => {
                toast.error("Email don't exit");
            })
        } else {
            toast.error("All inputs are required!!!");
        }
        
      }

      const checkCode = async() =>{
        if(code !== "")
        {
            if(code == pVerifyCode ){
                toast.success("Verify success :)");
                setAuthView('restPassword');
            }
            else{
                toast.error("Error Code!!")
            }
        }
        else
        {
          toast.error("The Inpu't required!!")
        }    
      }

      const confirmPassword = async()=>{
        if(newPassword !=="" && verifyPassword !== ""){
            if(newPassword === verifyPassword){
                const response = await fetch(baseURL + '/account/resetPassword/'+email, {
                    method: 'PUT',
                    headers: {'Content-Type' : 'application/json'},
                    body: JSON.stringify({
                        password:newPassword
                    })
                });
                const data = await response.json();
                console.log(data);
                if(data){
                 toast.success("Successfly update new password");
                 setAuthView('loginView');
                }
            }else{
                toast.warning("The password didn't poth!!");
            }
        }else{
           toast.error("The input required!!!");
        }                   
      }

    return(
        <>
        <Container>
            <ToastContainer />
            <Row>
                <Col xl={4}></Col>
                <Col xl={4} style={{
                    marginTop:100, 
                    padding:50, textAlign:'center',
                    backgroundColor:'#ffffff', borderRadius:20}}>
                {/* <img src="../../gamelogo.jpg" style={{width:200,aspectRatio:3/2,mixBlendMode:"darken"}} /> */}
                    {
                        authView === 'loginView' ? (
                            <>
                                <h3 style={{marginTop:15}}>Welcome Aboard</h3>
                                <p>Type your email and password to login</p>
                                <Form>
                                    <Form.Group>
                                        <Form.Label>Email address</Form.Label>
                                        <Form.Control type="email" value={email} onChange={(e) => {setEmail(e.target.value)}} />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control type="password" value={password} onChange={(e) => {setPassword(e.target.value)}} />
                                    </Form.Group>

                                    <Button variant="primary" style={{width:'100%', marginTop:15}} onClick={login}>Sign In</Button>
                                </Form>
                                <Button style={{marginTop:12}} variant="light" onClick={() => {setAuthView("registerView")}}>Don't have an account? Signup Now!</Button>
                                <Button style={{marginTop:12}} variant="light" onClick={() => {setAuthView("checkEmail")}}>Forget Password?</Button>

                            </>
                        )
                        : 
                        authView === 'registerView' ? (
                            <>
                                <h3 style={{marginTop:15}}>Create New Account</h3>
                                <p>Type your first and last name, mobile, email and password to sign up</p>
                                <Form>
                                    <Form.Group>
                                        <Form.Label>First name</Form.Label>
                                        <Form.Control type="text" value={firstName} onChange={(e) => {setFirstName(e.target.value)}} />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Last name</Form.Label>
                                        <Form.Control type="text" value={lastName} onChange={(e) => {setLastName(e.target.value)}} />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Mobile</Form.Label>
                                        <Form.Control type="text" value={mobile} onChange={(e) => {setMobile(e.target.value)}} />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Email address</Form.Label>
                                        <Form.Control type="email" value={email} onChange={(e) => {setEmail(e.target.value)}} />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control type="password" value={password} onChange={(e) => {setPassword(e.target.value)}} />
                                    </Form.Group>

                                    <Button variant="primary" style={{width:'100%', marginTop:15}} onClick={createNewAccount}>Sign Up</Button>
                                </Form>
                                <Button style={{marginTop:12}} variant="light" onClick={() => {setAuthView("loginView")}}>Back to login</Button>
                            </>
                        )
                        : authView === 'verifyView' ? (
                            <>
                                <h3 style={{marginTop:15}}>Verify code by phone number</h3>
                                <p>Please type your verification code</p>
                                    <Form>
                                        <Form.Group>
                                            <Form.Label>Code</Form.Label>
                                            <Form.Control type="text" value={code} onChange={(e) => {setCode(e.target.value)}} />
                                        </Form.Group>
                                        <Button variant="primary" style={{width:'100%', marginTop:15}} onClick={verifyMyCode}>Verify</Button>
                                    </Form>
                                    {/* <Button style={{marginTop:12}} variant="light" onClick={() => {setAuthView("checkPhone")}}>Verfication by phone number</Button> */}
                                    <Button style={{marginTop:12}} variant="light" onClick={() => {setAuthView("loginView")}}>Back to login</Button>
                            </>)
                        :
                        authView === 'checkEmail' ? (
                        <>
                            <h3 style={{marginTop:15}}>Enter you'r email</h3>       
                            <Form>
                                <Form.Group>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" value={email} onChange={(e) => {setEmail(e.target.value)}} />
                                </Form.Group>
                               <Button variant="primary" style={{width:'100%', marginTop:15}} onClick={checkEmail}>Send email</Button>
                            </Form>
                            <Button style={{marginTop:12}} variant="light" onClick={() => {setAuthView("loginView")}}>Back to login</Button>

                        </>)
                        :
                        authView === 'passwordVerifyCode'?(
                            <>
                            <h3 style={{marginTop:15}}>Verify code</h3>
                            <p>Please type your verification code</p>
                                <Form>
                                    <Form.Group>
                                        <Form.Label>Code</Form.Label>
                                        <Form.Control type="text" value={code} onChange={(e) => {setCode(e.target.value)}} />
                                    </Form.Group>
                                    <Button variant="primary" style={{width:'100%', marginTop:15}} onClick={checkCode}>Verify</Button>
                                </Form>
                                {/* <Button style={{marginTop:12}} variant="light" onClick={() => {setAuthView("loginView")}}>Back to login</Button> */}
                            </>
                        )
                        :
                        authView === 'restPassword'?(
                            <>
                            <h3 style={{marginTop:15}}>Reset you'r password</h3>
                            <Form>
                                <Form.Group>
                                    <Form.Label>New password</Form.Label>
                                    <Form.Control type="password" value={newPassword} onChange={(e) => {setNewPassword(e.target.value)}} />
                                    <Form.Label>Verify password</Form.Label>
                                    <Form.Control type="password" value={verifyPassword} onChange={(e) => {setVerifyPassword(e.target.value)}} />
                                </Form.Group>
                               <Button variant="primary" style={{width:'100%', marginTop:15}} onClick={confirmPassword}>Reset Password</Button>
                            </Form>
                            </>
                        )
                        :
                        <>
                          <h3 style={{marginTop:15}}></h3>

                        </>
                    }              
                </Col>
                <Col xl={4}></Col>
            </Row>
        </Container>       
        </>
    )
}

export default Login;