import React, {useState, useRef} from "react";
import {startCase} from "lodash";
import clsx from "clsx";
import { Link as RouterLink, useHistory} from "react-router-dom";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import FilledInput from "@material-ui/core/FilledInput";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import theme from "../assets/theme";
import {User, UserAPIResponse} from "../types";
import {loginUser} from "../api";
import useForm from "../hooks/useForm";
import LogoImg from "../components/HeaderLogo";
import {ErrorMessage} from "../components";

const useStyles = makeStyles({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  margin: {
    marginVertical: theme.spacing(1),
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    width: "25ch",
  },
});

const stateSchema = {
  email: { value: "", error: "" },
  password: { value: "", error: "" },
};
const validationStateSchema = {
  email: {
    required: true,
    validator: {
      regEx: /^\S+@\S+$/,
      error: "Invalid email format.",
    },
  },
  password: {
    required: true,
    validator: {
      regEx: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
      error: "Your password must contain at least six characters, including at least one letter and one number.",
    },
  },
};
interface StateProp { value: string; error: string;}
interface State {
  email: StateProp;
  password: StateProp;
}

const SignIn: React.FC =() => {
  const classes = useStyles();
  let history = useHistory();
  const inputSubmit = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [submitErrorMsg, setSubmitErrorMsg] = useState<string>("");

  const { state, disable, handleOnChange, handleOnSubmit } = useForm(
    stateSchema,
    validationStateSchema,
    onSubmitForm
  );

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword );
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleButtonSubmit = () => {
    inputSubmit.current && inputSubmit.current.click();
  };

  const manageAPIResponse =(response: UserAPIResponse| undefined ) => {
    if (response && response.data){
      localStorage.setItem("planet_auth_token", response.data.token );
      history.push("/");
    } else if (response && response.error){
      setSubmitErrorMsg(response.error);
    }
  };

  async function onSubmitForm(state: State) {
    const formattedState: Omit<User, "id"| "first_name"| "last_name"> = {
      email: state.email.value,
      password: state.password.value,
    };
    const response= await loginUser(formattedState);
    manageAPIResponse(response);
  }
  
  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <LogoImg />
        <Box m={2}>
        </Box>

        <Typography component="h1" variant="h5" paragraph>
            Sign in
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleOnSubmit}>
          
          <FormControl fullWidth className={classes.margin}>
            <InputLabel 
              variant="filled"
              required
              htmlFor="signup-email">Email Address</InputLabel>
            <FilledInput
              id="signup-email"
              value={state.email.value}
              onChange={handleOnChange}
              name="email"
              aria-describedby="email"
              inputProps={{
                "aria-label": "email",
              }}
              required
            />
            <ErrorMessage error={state.email.error}/>
          </FormControl>
          <FormControl fullWidth className={classes.margin} variant="filled">
            <InputLabel 
              variant="filled"
              required
              htmlFor="signup-password">Password</InputLabel>
            <FilledInput
              id="signup-password"
              type={showPassword ? "text" : "password"}
              value={state.password.value}
              onChange={handleOnChange}
              name="password"
              aria-describedby="password"
              inputProps={{
                "aria-label": "password",
              }}
              required
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <ErrorMessage error={state.password.error}/>
          </FormControl>
          <Box mb={2}>
            <Typography variant="body2" color="error" >{submitErrorMsg}</Typography>
          </Box>       
          <Box className={clsx(classes.margin, "col")}>
            {/* Submit button with the styles */}
            <Button
              disabled={disable}
              fullWidth
              variant="contained"
              color="primary"
              aria-label="sign up"
              className={classes.submit} 
              onClick={handleButtonSubmit}
            >
          Sign in
            </Button>
            {/* Submit input connected to useForm hook (not displayed) */}
            <input
              type="submit"
              ref={inputSubmit}
              name="submit" disabled={disable}
              value="Submit" 
              style={{display: "none"}}
            />
            {/* //////////////////// */}
            <Typography variant="body2" color="textSecondary" align="center" className={classes.form}>
        New at Planet Movies?     
              <Button
                component={RouterLink}
                to="/sign_up"
                variant="text"
                color="secondary"
                aria-label="sign up"
              >
          Register for free
              </Button>
            </Typography>
          </Box>
        </form>
      </div>
      <Box mt={8}>
      </Box>
    </Container>
  );
};
export default SignIn;
