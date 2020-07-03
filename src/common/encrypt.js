import JSEncrypt from 'jsencrypt'
/*
 * 对密码进行RSA加密，传输给后台进行验证
 * @param {String}   word  需要加密的密码
 * @param {String}   keyStr  对密码加密的秘钥
 * @return {String}   加密的密文
 * */
var encrypt = (password, publicKey) => {
    let jse = new JSEncrypt()
    jse.setPublicKey(publicKey)
    let encrypted = jse.encrypt(password)
    return encrypted.toString()
}

export default {
    encrypt
}
