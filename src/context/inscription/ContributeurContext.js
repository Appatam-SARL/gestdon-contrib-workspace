import React,{createContext} from 'react'

export const ContributeurContext = createContext({cheildren})
const InsContribProvider = () => {
    const [data, setData] = React.useState({
        nom: '',
        prenom: '',
        email: '',
        password: '',
        role: 'contributeur',
        type: 'contributeur'
    })
    const handleChangeData = (field,value) => {
        setData({
            ...data,
            [field]: value
        })
    }   
  return (
    <ContributeurContext.Provider value={{data,handleChangeData}}>
        {children}
    </ContributeurContext.Provider>
  )
}

export default InsContribProvider