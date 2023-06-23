import { Login, Register, Home } from "./components";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { login, setToken } from "./redux/reducers/user";
import { Center, Spinner } from "@chakra-ui/react";
import NotFound from "./components/NotFound/NotFound";

function App() {
  const { user, token } = useSelector((state) => state.user);

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token && !user) {
      setLoading(true);
      axios
        .get("/api/users/token", {
          headers: {
            "x-token": token,
          },
        })
        .then((res) => {
          dispatch(login({ user: res.data }));
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else if (!token && !user) {
      const token = sessionStorage.getItem("token");
      if (token) {
        dispatch(setToken({ token }));
      }
    }
  }, [user, token, dispatch]);

  return (
    <>
      {loading ? (
        <Center h="100vh" bg="gray.50">
          <Spinner size="xl" />
        </Center>
      ) : (
        <Routes>
          <Route
            exact
            path="/"
            element={user ? <Home /> : <Navigate to="/login" replace={true} />}
          />
          <Route
            exact
            path="/register"
            element={!user ? <Register /> : <Navigate to="/" replace={true} />}
          />
          <Route
            exact
            path="/login"
            element={!user ? <Login /> : <Navigate to="/" replace={true} />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
    </>
  );
}

export default App;
