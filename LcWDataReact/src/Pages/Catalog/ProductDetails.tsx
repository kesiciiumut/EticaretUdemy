import { Divider, Grid, Table, TableBody, TableCell, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import type {  Product } from "../../Model/IProduct";


export default function ProductDetail( ){
    const {id} =useParams();
    const [product, setProduct]=useState<Product[]>([]);
    const [loading , setLoading] = useState(true);
    


    useEffect(()=>{fetch(`https://localhost:44322/api/product/${id}`)
        .then(res=>res.json())
        .then(data=>setProduct(data))
        .catch(error=>console
        .log("API den Gelen Veri",error))
        .finally(()=> setLoading(false))},[id]);
        
        return(<>
            <Grid container spacing={2}>
                <Grid size ={{xl:3,lg:4 , md:5 ,sm : 6,xs :12}}>
                    <img src={`https://localhost:44322/images/${product[0]?.imageUrl}`}style ={{width : "%100"}}/>

                </Grid>
                <Grid size ={{xl:9,lg:8,md:7,sm:6,xs:12}}>
                    <Typography variant="h3">{product[0]?.productName}</Typography>
                    <Divider sx={{mb:2}}/>
                    <Typography variant="h4" color="secondary">{product[0]?.stock?.quantity}₺</Typography>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>Ürün Adı</TableCell>
                                <TableCell>{product[0]?.productName}</TableCell>
                            </TableRow>
                        
                            <TableRow>
                                <TableCell>Açıklaması</TableCell>
                                <TableCell>{product[0]?.productDescription}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Stok Miktarı</TableCell>
                                <TableCell>{product[0]?.stock?.quantity}</TableCell>
                            </TableRow>
                        </TableBody>

                    </Table>
                </Grid>
            </Grid>
    
        
        </>)

        
    
}