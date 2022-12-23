import { Button, Divider, FormControl, InputAdornment, InputLabel, MenuItem, OutlinedInput, Paper, Select, Stack, TextField, Typography } from '@mui/material'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { NumericFormat } from 'react-number-format'

export default function Cotacao() {
  const [ freteValor, setFreteValor ] = useState(0)
  const [ pedagio, setPedagio ] = useState(0)
  const [ escolhaAliqICMS, setEscolhaAliqICMS ] = useState("")
  const [ escolhaCoop, setEscolhaCoop ] = useState("")
  const [ eixos, setEixos ] = useState("6")
  const [ tabela, setTabela ] = useState("Tabela A")
  const [ categoria, setCategoria ] = useState("Carga Geral")
  let baseCalculo = 1 - escolhaAliqICMS - escolhaCoop;
  let vlrFvPed = freteValor + pedagio;
  let vlrTotalComICMS = vlrFvPed / baseCalculo;
  let cooperativa = vlrTotalComICMS * escolhaCoop;
  let icms = vlrTotalComICMS * escolhaAliqICMS;
  let vlrTotal = freteValor + pedagio + cooperativa;

  // switch (tabela) {
  //   case "Carga Geral":
  //     return switch (categoria) {
  //       case value:
          
  //         break;
      
  //       default:
  //         break;
  //     }
  //     break;
    
  //   default:
  //     break;
  // }

  

  return (
    <div>
      <Paper elevation={2} sx={{mx: "auto", mt: 5, mb: 2, p: 2, width: 350}}>
        <Typography variant='h5' textAlign="center">Tabela ANTT</Typography>
        <Stack
          direction="row"
          sx={{mt: 2, mb: 1}}
        >
          <Typography sx={{width: 100,}}>Distancia</Typography>
          <FormControl sx={{width: 120, mr: "10px"}} size="small" variant="outlined">
            <OutlinedInput
              endAdornment={<InputAdornment position="end">Km</InputAdornment>}
            />
          </FormControl>
          <FormControl size="small" sx={{width: 120}}>
            <InputLabel id="eixo-label">Eixos</InputLabel>
            <Select
              labelId="eixo-label"
              id="select-helper"
              label="Eixos"
              value={eixos}
              onChange={(valuePick) => {
                console.log(valuePick.target.value);
              }}
            >
              <MenuItem value="">
                <em>Escolher</em>
              </MenuItem>
              <MenuItem value={2}>{"2 Eixos"}</MenuItem>
              <MenuItem value={3}>{"3 Eixos"}</MenuItem>
              <MenuItem value={4}>{"4 Eixos"}</MenuItem>
              <MenuItem value={5}>{"5 Eixos"}</MenuItem>
              <MenuItem value={6}>{"6 Eixos"}</MenuItem>
              <MenuItem value={7}>{"7 Eixos"}</MenuItem>
              <MenuItem value={8}>{"8 Eixos"}</MenuItem>
              <MenuItem value={9}>{"9 Eixos"}</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        <FormControl sx={{my: 1}} size="small" fullWidth>
          <InputLabel id="tabela-label">Tabela</InputLabel>
          <Select
            labelId="tabela-label"
            label="Tabela"
            value={tabela}
            onChange={(valuePick) => {
              console.log(valuePick.target.value);
            }}
          >
            <MenuItem value="">
              <em>Escolher</em>
            </MenuItem>
            <MenuItem value="Tabela A">{"Tabela A - Lotação"}</MenuItem>
            <MenuItem value="Tabela B">{"Tabela B - Agregados"}</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{my: 1}} size="small" fullWidth>
          <InputLabel id="categoria-label">Categoria</InputLabel>
          <Select
            labelId="categoria-label"
            label="Categoria"
            value={categoria}
            onChange={(valuePick) => {
              console.log(valuePick.target.value);
            }}
          >
            <MenuItem value="">
              <em>Escolher</em>
            </MenuItem>
            <MenuItem value="Granel sólido">{"Granel sólido"}</MenuItem>
            <MenuItem value="Granel líquido">{"Granel líquido"}</MenuItem>
            <MenuItem value="Frigorificada ou Aquecida">{"Frigorificada ou Aquecida"}</MenuItem>
            <MenuItem value="Conteinerizada">{"Conteinerizada"}</MenuItem>
            <MenuItem value="Carga Geral">{"Carga Geral"}</MenuItem>
            <MenuItem value="Neogranel">{"Neogranel"}</MenuItem>
            <MenuItem value="Perigosa (granel sólido)">{"Perigosa (granel sólido)"}</MenuItem>
            <MenuItem value="Perigosa (granel líquido)">{"Perigosa (granel líquido)"}</MenuItem>
            <MenuItem value="Perigosa (frigorificada ou aquecida)">{"Perigosa (frigorificada ou aquecida)"}</MenuItem>
            <MenuItem value="Perigosa (conteinerizada)">{"Perigosa (conteinerizada)"}</MenuItem>
            <MenuItem value="Perigosa (carga geral)">{"Perigosa (carga geral)"}</MenuItem>
            <MenuItem value="Carga Granel Pressurizada">{"Carga Granel Pressurizada"}</MenuItem>
          </Select>
        </FormControl>
        <Stack
          direction="row"
          sx={{my: 1}}
        >
          <Typography sx={{width: 150, my: "auto"}}>Valor ANTT</Typography>
          <NumericFormat
            sx={{width: 200}}
            customInput={TextField}
            size="small"
            variant="standard"
            inputProps={{ readOnly: true }}
            decimalScale={2}
            fixedDecimalScale
            decimalSeparator=","
            prefix={"R$"}
            thousandsGroupStyle="thousand"
            thousandSeparator="."
            //value={}
          />
        </Stack>
      </Paper>
      <Paper elevation={2} sx={{mx: "auto", mb: 2, p: 2, width: 350}}>
        <Typography variant='h5' textAlign="center">Criar Cotação</Typography>
        <Stack
          direction="column"
        >
          <Stack //frete Valor
            direction="row"
            sx={{mt: 2, mb: 1}}
          >
            <Typography sx={{width: 150, my: "auto"}}>Frete Valor</Typography>
            <NumericFormat
              sx={{width: 200}}
              customInput={TextField}
              size="small"
              decimalScale={2}
              fixedDecimalScale
              decimalSeparator=","
              prefix={"R$"}
              thousandsGroupStyle="thousand"
              thousandSeparator="."
              defaultValue=""
              onValueChange={(values) => {
                setFreteValor(values.floatValue);
              }}
            />
          </Stack>
          <Stack //pedagio
            direction="row"
            sx={{my: 1}}
          >
            <Typography sx={{width: 150, my: "auto"}}>Pedágio</Typography>
            <NumericFormat
              sx={{width: 200}}
              customInput={TextField}
              size="small"
              decimalScale={2}
              fixedDecimalScale
              decimalSeparator=","
              prefix={"R$"}
              thousandsGroupStyle="thousand"
              thousandSeparator="."
              defaultValue=""
              onValueChange={(values) => {
                setPedagio(values.floatValue);
              }}
            />
          </Stack>
          <Divider sx={{my: 1}}/>
          <Stack //cooperativa
            direction="row"
            sx={{my: 1}}
          >
            <Typography sx={{width: 150, my: "auto"}}>Cooperativa</Typography>
            <NumericFormat
              sx={{width: 200}}
              customInput={TextField}
              size="small"
              variant="standard"
              inputProps={{ readOnly: true }}
              decimalScale={2}
              fixedDecimalScale
              decimalSeparator=","
              prefix={"R$"}
              thousandsGroupStyle="thousand"
              thousandSeparator="."
              value={cooperativa}
            />
          </Stack>
          <Stack //total
            direction="row"
            sx={{my: 1}}
          >
            <Typography sx={{width: 150, my: "auto"}}>Total</Typography>
            <NumericFormat
              sx={{width: 200}}
              customInput={TextField}
              size="small"
              variant="standard"
              inputProps={{ readOnly: true }}
              decimalScale={2}
              fixedDecimalScale
              decimalSeparator=","
              prefix={"R$"}
              thousandsGroupStyle="thousand"
              thousandSeparator="."
              value={vlrTotal}
            />
          </Stack>
          <Stack //ICMS
            direction="row"
            sx={{mb: 1, mt: 5,}}
          >
            <Typography sx={{width: 150, my: "auto"}}>ICMS</Typography>
            <NumericFormat
              sx={{width: 200}}
              customInput={TextField}
              size="small"
              variant="standard"
              inputProps={{ readOnly: true }}
              decimalScale={2}
              fixedDecimalScale
              decimalSeparator=","
              prefix={"R$"}
              thousandsGroupStyle="thousand"
              thousandSeparator="."
              value={icms}
            />
          </Stack>
          <Stack //total com ICMS
            direction="row"
            sx={{my: 1}}
          >
            <Typography sx={{width: 150, my: "auto"}}>Total com ICMS</Typography>
            <NumericFormat
              sx={{width: 200}}
              customInput={TextField}
              size="small"
              variant="standard"
              inputProps={{ readOnly: true }} 
              decimalScale={2}
              fixedDecimalScale
              decimalSeparator=","
              prefix={"R$"}
              thousandsGroupStyle="thousand"
              thousandSeparator="."
              value={vlrTotalComICMS}
            />
          </Stack>
          <Divider sx={{my: 1}}/>
          <Stack //total com ICMS
            direction="column"
            spacing={2}
            sx={{my: 1}}
          >
            <FormControl size="small" fullWidth>
              <InputLabel id="coop-label">Porcentagem Cooperativa</InputLabel>
              <Select
                labelId="coop-label"
                id="select-helper"
                label="Porcentagem Cooperativa"
                value={escolhaCoop}
                onChange={(valuePick) => {
                  setEscolhaCoop(valuePick.target.value);
                }}
              >
                <MenuItem value="">
                  <em>Escolher</em>
                </MenuItem>
                <MenuItem value={0.06}>{"6%"}</MenuItem>
                <MenuItem value={0.12}>{"12%"}</MenuItem>
                <MenuItem value={0}>{"Sem Cooperativa"}</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" fullWidth>
              <InputLabel id="icms-label">Alíquota ICMS</InputLabel>
              <Select
                labelId="icms-label"
                id="select-helper"
                label="Alíquota ICMS"
                value={escolhaAliqICMS}
                onChange={(valuePick) => {
                  setEscolhaAliqICMS(valuePick.target.value);
                }}
              >
                <MenuItem value="">
                  <em>Escolher</em>
                </MenuItem>
                <MenuItem value={0.07}>{"7%"}</MenuItem>
                <MenuItem value={0.12}>{"12%"}</MenuItem>
                <MenuItem value={0.14}>{"12% + 2%(FCP)"}</MenuItem>
                <MenuItem value={0.2}>{"18% + 2%(FCP)"}</MenuItem>
                <MenuItem value={0}>{"Sem ICMS"}</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <CopyToClipboard 
            //onCopy={onCopy} 
            text={"teste"}
          >
            <Button variant="contained" color="success">Copiar cotação</Button>
          </CopyToClipboard>
        </Stack>
      </Paper>
    </div>
  )
}
