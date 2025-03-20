import axios from "axios";

class ApiRest {
  constructor() {
    this.env = process.env.REACT_APP_ENV || "err";
    this.url =
      this.env === "LOCAL"
        ? process.env.REACT_APP_DOMINO_URL_LOCAL || "err"
        : process.env.REACT_APP_DOMINO_URL_DEV || "err";
  }

  //login method
  async login(username, password) {
    const url =
      this.env === "LOCAL" ? `${this.url}/login` : `${this.url}/auth/login`;
    console.log(url);
    try {
      const response = await axios.post(
        url,
        {
          data: {
            username,
            password,
          },
        },
        {
          auth: {
            username,
            password,
          },
        }
      );
      const { data } = response;
      // console.log('login response: ' + data)
      return data;
    } catch (error) {
      console.log("login error: " + error);
      throw error;
    }
  }

  //fetch user info
  async getInfo(token) {
    const url =
      this.env === "LOCAL"
        ? `${this.url}/getInfo`
        : `${this.url}/extapp/ispprj/getInfo`;
    console.log(url);
    try {
      const response = await axios.post(url, { data: { token } });
      const { data } = response;
      // console.log('login response: ' + data)
      return data;
    } catch (error) {
      console.log("login error: " + error);
      throw error;
    }
  }

  //fetch dashboard data to display in table
  async getProjects(token) {
    const url =
      this.env === "LOCAL"
        ? `${this.url}/getProjects`
        : `${this.url}/extapp/ispprj/getProjects`;
    console.log(url);
    try {
      const response = await axios.post(url, { data: { token } });
      const { data } = response;
      // console.log('getProjects response: ' + JSON.stringify(data))
      return data;
    } catch (error) {
      console.log("getProjects error: " + error);
      throw error;
    }
  }

  //fetch a project item to display in table
  async getItems(token, id) {
    const url =
      this.env === "LOCAL"
        ? `${this.url}/getProjectItems`
        : `${this.url}/extapp/ispprj/getProjectItems?projectid=${id}`;
    console.log(url);
    try {
      const response = await axios.post(url, {
        data: {
          id,
          token,
          details: true,
        },
      });
      const { data } = response;
      // console.log('getProjectItems response: ' + JSON.stringify(data))
      return data;
    } catch (error) {
      console.log("getProjectItems error: " + error);
      throw error;
    }
  }

  //allocation data

  async getItemAllocation(pnCliente, token) {
    const url =
      this.env === "LOCAL"
        ? `${this.url}/getItemAllocation`
        : `${this.url}/extapp/ispprj/getItemAllocation?pcid=${pnCliente}`;
    //const url =`${this.url}/extapp/ispprj/getItemAllocation?pcid=${pnCliente}`

    console.log("Chiamata API getItemAllocation:", url);
    console.log("Dati inviati:", { pnCliente, token });

    try {
      const response = await axios.post(url, {
        data: {
          pnCliente,
          token,
        },
      });
      const { data } = response;
      return data;
    } catch (error) {
      console.error(
        "Errore in getItemAllocation:",
        error.response ? error.response.data : error
      );
      throw error;
    }
  }

  async getDisponibile(token, pn) {
    const url =
      this.env === "LOCAL"
        ? `${this.url}/getDisponibile`
        : `${this.url}/extapp/ispprj/getStock?pn=${pn}&onlydispo=true`;
    console.log("Chiamata API getItemAllocation:", url);
    console.log("Dati inviati:", { pn, token });

    try {
      const response = await axios.post(url, {
        data: { token, pn },
      });
      const { data } = response;
      return data;
    } catch (error) {
      console.log("getStock error: " + error);
      throw error;
    }
  }

  //update a project item details
  async updateProjectItem(item) {
    const url = `${this.url}/extapp/hpprj/uItem`;
    console.log(item);
    // return body
    try {
      const response = await axios.post(url, item);
      const { data } = response;
      console.log("updateProjectItem response: " + JSON.stringify(data));
      return data;
    } catch (error) {
      console.log("updateProjectItem error: " + error);
      throw error;
    }
  }

  //create new project
  async iuProject(token, payload) {
    const url =
      this.env === "LOCAL"
        ? `${this.url}/iuProject`
        : `${this.url}/extapp/ispprj/iuProject`;
    // const body = payload
    console.log(payload);
    try {
      const response = await axios.post(
        url,
        this.env === "LOCAL" ? { data: { token, item: payload } } : payload
      );
      const { data } = response;
      console.log("iuProject response: " + JSON.stringify(data));
      return data;
    } catch (error) {
      console.log("iuProject error: " + error);
      throw error;
    }
  }

  //upload file
  async uploadFile(file, id) {
    let response = "";
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      console.log(reader.result, id);
      response = await this.newUpdateProject({
        state: {
          0: id,
          file: reader.result.split("base64,")[1],
          name: file.name,
        },
      });
      console.log("File uploaded!", response);
      return response;
    };
    reader.onerror = (error) => {
      console.log("Error: " + error);
      response = error;
    };
    return response;
  }

  //fetch data from lambda for stock view
  async getStock(token) {
    const url =
      this.env === "LOCAL"
        ? `${this.url}/getStock`
        : `${this.url}/extapp/ispprj/getStock`;
    console.log(url);
    try {
      const response = await axios.post(url, { data: { token } });
      const { data } = response;
      // console.log('getProjects response: ' + JSON.stringify(data))
      return data;
    } catch (error) {
      console.log("getStock error: " + error);
      throw error;
    }
  }

  //fetch requests
  async getRequests(token) {
    const url =
      this.env === "LOCAL"
        ? `${this.url}/getRequests`
        : `${this.url}/extapp/ispprj/getRequests`;
    console.log(url);
    try {
      const response = await axios.post(url, { data: { token } });
      const { data } = response;
      // console.log('getProjects response: ' + JSON.stringify(data))
      return data;
    } catch (error) {
      console.log("getRequests error: " + error);
      throw error;
    }
  }

  //logout
  async logout() {
    const url = `${this.url}/appl/wsr.nsf?logout`;
    console.log(url);
    try {
      await axios.get(url);
    } catch (error) {
      console.log("Logout error: " + error);
      throw error;
    }
  }
}

export default ApiRest;
/*

import axios from "axios";

class ApiRest {
  constructor() {
    this.url = process.env.REACT_APP_DOMINO_URL_DEV || "err";
  }

  //login method
  async login(username, password) {
    const url = `${this.url}/auth/login`;
    console.log(url);
    try {
      const response = await axios.post(
        url,
        {
          data: {
            username,
            password,
          },
        },
        {
          auth: {
            username,
            password,
          },
        }
      );
      const { data } = response;
      return data;
    } catch (error) {
      console.log("login error: " + error);
      throw error;
    }
  }

  //fetch user info
  async getInfo(token) {
    const url = `${this.url}/extapp/ispprj/getInfo`;
    console.log(url);
    try {
      const response = await axios.post(url, { data: { token } });
      const { data } = response;
      return data;
    } catch (error) {
      console.log("getInfo error: " + error);
      throw error;
    }
  }

  //fetch dashboard data to display in table
  async getProjects(token) {
    const url = `${this.url}/extapp/ispprj/getProjects`;
    console.log(url);
    try {
      const response = await axios.post(url, { data: { token } });
      const { data } = response;
      return data;
    } catch (error) {
      console.log("getProjects error: " + error);
      throw error;
    }
  }

  //fetch a project item to display in table
  async getItems(token, id) {
    const url = `${this.url}/extapp/ispprj/getProjectItems?projectid=${id}`;
    console.log(url);
    try {
      const response = await axios.post(url, {
        data: {
          id,
          token,
        },
      });
      const { data } = response;
      return data;
    } catch (error) {
      console.log("getProjectItems error: " + error);
      throw error;
    }
  }

  //update a project item details
  async updateProjectItem(item) {
    const url = `${this.url}/extapp/hpprj/uItem`;
    console.log(item);
    try {
      const response = await axios.post(url, item);
      const { data } = response;
      return data;
    } catch (error) {
      console.log("updateProjectItem error: " + error);
      throw error;
    }
  }

  //create new project
  async iuProject(token, payload) {
    const url = `${this.url}/extapp/ispprj/iuProject`;
    console.log(payload);
    try {
      const response = await axios.post(url, payload);
      const { data } = response;
      return data;
    } catch (error) {
      console.log("iuProject error: " + error);
      throw error;
    }
  }

  //upload file
  async uploadFile(file, id) {
    let response = "";
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      console.log(reader.result, id);
      response = await this.newUpdateProject({
        state: {
          0: id,
          file: reader.result.split("base64,")[1],
          name: file.name,
        },
      });
      console.log("File uploaded!", response);
      return response;
    };
    reader.onerror = (error) => {
      console.log("Error: " + error);
      response = error;
    };
    return response;
  }

  //fetch data from lambda for stock view
  async getStock(token) {
    const url = `${this.url}/extapp/ispprj/getStock`;
    console.log(url);
    try {
      const response = await axios.post(url, { data: { token } });
      const { data } = response;
      return data;
    } catch (error) {
      console.log("getStock error: " + error);
      throw error;
    }
  }

  //fetch requests
  async getRequests(token) {
    const url = `${this.url}/extapp/ispprj/getRequests`;
    console.log(url);
    try {
      const response = await axios.post(url, { data: { token } });
      const { data } = response;
      return data;
    } catch (error) {
      console.log("getRequests error: " + error);
      throw error;
    }
  }

  //logout
  async logout() {
    const url = `${this.url}/appl/wsr.nsf?logout`;
    console.log(url);
    try {
      await axios.get(url);
    } catch (error) {
      console.log("Logout error: " + error);
      throw error;
    }
  }
}

export default ApiRest;
*/
