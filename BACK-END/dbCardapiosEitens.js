var config = require("./dbconfig")
const sql = require("mssql");

async function selectLanches(){
    try{
        let pool = await sql.connect(config);
        let res = await pool.request().query("select * from SabDiv.itensCardapioLanches");
        return res.recordsets;
    } catch (error){
        console.log("erros: " + error)
    }
}

async function selectBebidas(){
    try{
        let pool = await sql.connect(config);
        let res = await pool.request().query("select * from SabDiv.itensCardapioBebidas");
        return res.recordsets;
    } catch (error){
        console.log("erros: " + error)
    }
}

async function selectSobremesas(){
    try{
        let pool = await sql.connect(config);
        let res = await pool.request().query("select * from SabDiv.itensCardapioSobremesas");
        return res.recordsets;
    } catch (error){
        console.log("erros: " + error)
    }
}


module.exports = {
    selectLanches: selectLanches,
    selectBebidas: selectBebidas,
    selectSobremesas: selectSobremesas
}