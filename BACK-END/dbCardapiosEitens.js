const config = require("./dbconfig")
const sql = require("mssql");
then
//http://localhost:3000/selectLanches
async function selectLanches(){
    let pool;
    try{
        pool = await sql.connect(config);
        let res = await pool.request().query("select * from SabDiv.itensCardapioLanches");
        return res.recordsets;
    } catch (error){
        console.log("erros: " + error)
    } finally{
        if(pool){
            pool.close()
        }
    }
}

async function selectBebidas(){
    let pool;
    try{
        pool = await sql.connect(config);
        let res = await pool.request().query("select * from SabDiv.itensCardapioBebidas");
        return res.recordsets;
    } catch (error){
        console.log("erros: " + error)
    } finally{
        if(pool){
            pool.close()
        }
    }
}

async function selectSobremesas(){
    let pool;
    try{
        pool = await sql.connect(config);
        let res = await pool.request().query("select * from SabDiv.Sobremesas");
        return res.recordsets;
    } catch (error){
        console.log("erros: " + error)
    } finally{
        if(pool){
            pool.close()
        }
    }
}


module.exports = {
    selectLanches: selectLanches,
    selectBebidas: selectBebidas,
    selectSobremesas: selectSobremesas
}
