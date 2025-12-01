import { Box, Typography, Grid, Card, CardContent, CardActions, Button } from '@mui/material';

const marketplaces = [
  {
    name: 'Trendyol',
    image: 'İmages/trendyol.png',
    url: 'https://www.trendyol.com/magaza/umutkesici-m-123456',
  },
  {
    name: 'Hepsiburada',
    image: 'İmages/hepsiburada.png',
    url: 'https://www.hepsiburada.com/magaza/umutkesici',
  },
  {
    name: 'N11',
    image: 'İmages/n11.png',
    url: 'https://www.n11.com/magaza/umutkesici',
  },
  {
    name: 'ÇiçekSepeti',
    image: 'İmages/çiçeksepeti.png', 
    url: 'https://www.ciceksepeti.com/magaza/umutkesici',
  },
];

export default function MarketPlacesPage() {
  return (
    <Box sx={{ px: 1, py: 6, minHeight: '100vh' }}>
      <Typography variant="h4" align="center" mt={-8} mb={10}>
        Pazaryerlerindeki Mağazalarımız
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {marketplaces.map((market, index) => (
          <Grid item key={index} xs={12} sm={6} md={3}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 2,
                textAlign: 'center',
              }}
              elevation={3}
            >
              <Box
                component="img"
                src={market.image}
                alt={market.name}
                sx={{
                  height: 60,
                  width: 'auto',
                  objectFit: 'contain',
                  mb: 2,
                  mt: 1,
                }}
              />
              <CardContent>
                <Typography variant="h6">{market.name}</Typography>
              </CardContent>
              <CardActions sx={{ width: '100%', px: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  href={market.url}
                  target="_blank"
                >
                  Mağazaya Git
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
