---
title: 加解密
sidebar_position: 3
---

### 字符集

可以使用 Charset 类的 `static Charset forName(String charsetName)` 方法获取 Charset 对象。对于一些常用的编码类，也可以使用 StandardCharsets 的静态变量获取，如 utf8

```java
Charset gbk = Charset.forName("GBK");
String name = gbk.name(); //"GBK"
Charset utf8 = Charset.forName("UTF-8");
String name1 = utf8.name(); //"UTF-8"
Charset utf81 = StandardCharsets.UTF_8;
```

可以使用 String 的 getBytes(Charset charset) 方法获取字节数组，也可以不传 Charset 使用默认编码。

```java
String s = "a王";
byte[] bytes = s.getBytes(StandardCharsets.UTF_8); //{97,-25,-114,-117}
```
### Base64 编码

Base64 编码，可以使用 jdk 自带的 `java.util.Base64` 获取编码和解码器，对字节数组进行 base64 编码

```java
String s = "a王";
byte[] bytes = s.getBytes(StandardCharsets.UTF_8);
String base64Str = Base64.getEncoder().encodeToString(bytes); //YeeOiw==
byte[] decode = Base64.getDecoder().decode(base64Str);
String str = new String(decode, StandardCharsets.UTF_8);
```

### URL 编码

```java
String s="hello world 王";
String encoded = URLEncoder.encode(s, StandardCharsets.UTF_8); //hello+world+%E7%8E%8B
String decoded = URLDecoder.decode(encoded, StandardCharsets.UTF_8);
```

### 摘要算法

使用 MessageDigest.getInstance(String algorithm) 方法获取摘要加密类，例如 MD5 和 SHA-256

```java
MessageDigest md5 = MessageDigest.getInstance("MD5");
byte[] digest = md5.digest("123".getBytes());
/*
md5.update("123".getBytes());
byte[] digest1 = md5.digest();
*/
md5.update("123".getBytes());
digest = md5.digest();
String s = bytes2HexStr(digest); //202CB962AC59075B964B07152D234B70

MessageDigest sha256 = MessageDigest.getInstance("SHA-256");
digest = sha256.digest("123".getBytes());
s = bytes2HexStr(digest); //A665A45920422F9D417E4867EFDC4FB8A04A1F3FFF1FA07E998E86F7F7A27AE3
```

可以用一个方法将字节数组转化为十六进制字符串，每个字节用两个十六进制字符表示


```java
public static char[] HEX_ARRAY="0123456789ABCDEF".toCharArray();

public String bytes2HexStr(byte[] bytes){
    char[] ret=new char[bytes.length << 1];
    for(int i=0;i<bytes.length;++i){
        int val= bytes[i] & 0xFF;
        int index=i<<1;
        ret[index] = HEX_ARRAY[val >>> 4 ];
        ret[index+1] = HEX_ARRAY[val & 0x0f];
    }
    return String.valueOf(ret);
}
```

### 对称加密

DES 加解密


```java
@Test
public void testDes() throws NoSuchPaddingException, NoSuchAlgorithmException,
        UnsupportedEncodingException, InvalidKeyException, IllegalBlockSizeException, BadPaddingException {
    String key = "12345678";
    String plain = "hello world";
    plain = "hello world";
    String encodeStr = encodeDES(plain, key); //KNugLrX23UddguNoHIO7dw==
    System.out.println(encodeStr);
    String decodeStr = decodeDES(encodeStr, key);
    System.out.println(decodeStr);
}

public String encodeDES(String plainStr, String key) throws NoSuchPaddingException, NoSuchAlgorithmException,
        InvalidKeyException, IllegalBlockSizeException, BadPaddingException {
    SecretKey secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "DES");
    Cipher cipher = Cipher.getInstance("DES");
    cipher.init(Cipher.ENCRYPT_MODE, secretKey);
    byte[] encodedBytes = cipher.doFinal(plainStr.getBytes(StandardCharsets.UTF_8));
    return Base64.getEncoder().encodeToString(encodedBytes);
}

public String decodeDES(String encodedStr, String key) throws NoSuchPaddingException,
        NoSuchAlgorithmException, InvalidKeyException, IllegalBlockSizeException, BadPaddingException {
    SecretKey secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "DES");
    Cipher cipher = Cipher.getInstance("DES");
    cipher.init(Cipher.DECRYPT_MODE, secretKey);
    byte[] encodedBytes = Base64.getDecoder().decode(encodedStr);
    byte[] decodedBytes = cipher.doFinal(encodedBytes);
    return new String(decodedBytes, StandardCharsets.UTF_8);
}
```

AES 加解密

```java
@Test
public void testAes() throws NoSuchPaddingException, NoSuchAlgorithmException,
        UnsupportedEncodingException, InvalidKeyException, IllegalBlockSizeException, BadPaddingException {
    String key = "1234567812345678";
    String plain = "hello world";
    plain = "hello world";
    String encodeStr = encodeAES(plain, key); //Z1jAYXYOkKaeXk38DGHBAg==
    System.out.println(encodeStr);
    String decodeStr = decodeAES(encodeStr, key);
    System.out.println(decodeStr);
}

public String encodeAES(String plainStr, String key) throws NoSuchPaddingException,    NoSuchAlgorithmException,
        InvalidKeyException, IllegalBlockSizeException, BadPaddingException {
    SecretKey secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "AES");
    Cipher cipher = Cipher.getInstance("AES");
    cipher.init(Cipher.ENCRYPT_MODE, secretKey);
    byte[] encodedBytes = cipher.doFinal(plainStr.getBytes(StandardCharsets.UTF_8));
    return Base64.getEncoder().encodeToString(encodedBytes);
}

public String decodeAES(String encodedStr, String key) throws NoSuchPaddingException,
        NoSuchAlgorithmException, InvalidKeyException, IllegalBlockSizeException, BadPaddingException {
    SecretKey secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "AES");
    Cipher cipher = Cipher.getInstance("AES");
    cipher.init(Cipher.DECRYPT_MODE, secretKey);
    byte[] encodedBytes = Base64.getDecoder().decode(encodedStr);
    byte[] decodedBytes = cipher.doFinal(encodedBytes);
    return new String(decodedBytes, StandardCharsets.UTF_8);
}
```

ECB 模式（Electronic Codebook）

分成很多块，每个块使用同样的 key 独立加密，然后组合到一起，可以并行处理，速度快。

CBC 模式（Cipher Block Chain）

每个明文块与前一个异或处理后再进行加密，每个明文块都取决于前面的密文块，第一个明文块前面没有，需要一个 Initialization Vector 


### 非对称加密

RSA 

生成公私钥

```java
KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
KeyPair keyPair = keyPairGenerator.generateKeyPair();
PublicKey publicKey = keyPair.getPublic();
PrivateKey privateKey = keyPair.getPrivate();
byte[] encodedPublicKey = publicKey.getEncoded();
byte[] encodedPrivateKey = privateKey.getEncoded();
String publicKeyStr = Base64.getEncoder().encodeToString(encodedPublicKey);
String privateKeyStr = Base64.getEncoder().encodeToString(encodedPrivateKey);
```

由 Base64 格式的密钥生成秘钥类

```java
public Key getPublicKey(String key, String algorithm) throws NoSuchAlgorithmException, InvalidKeySpecException {
    KeyFactory keyFactory = KeyFactory.getInstance(algorithm);
    byte[] bytesKey = Base64.getDecoder().decode(key.getBytes(StandardCharsets.UTF_8));
    X509EncodedKeySpec x509EncodedKeySpec = new X509EncodedKeySpec(bytesKey); //规范
    return keyFactory.generatePublic(x509EncodedKeySpec);
}

public Key getPrivateKey(String key, String algorithm) throws NoSuchAlgorithmException, InvalidKeySpecException {
    KeyFactory keyFactory = KeyFactory.getInstance(algorithm);
    byte[] bytesKey = Base64.getDecoder().decode(key.getBytes(StandardCharsets.UTF_8));
    PKCS8EncodedKeySpec pkcs8EncodedKeySpec = new PKCS8EncodedKeySpec(bytesKey); //规范
    return keyFactory.generatePrivate(pkcs8EncodedKeySpec);
}

@Test
public void testRSA() throws NoSuchAlgorithmException, InvalidKeySpecException {
    String privatekeyStr = "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCanWbkkyNZp3NUlCAb5AHWhl65VpoAmVqy7quKy2Fri1K5v3a7YciHf1DD9dh7tJlnNXakgNQPz9ZvMukb0tKB5OE1F5v3HN6aOu+OnlOhCHxgJnqBD7n7pok+j1jytzqRJsvoGn9aSdUrAoB5RyVB7IIabUmBjl0pG3Yz7jdxqlJbHMnn1uPVUjxbm3FP4ti8HZayCAjQ/2oxVEWgqhExRWEqCrcb0H22oIbIdBDq9Hf5VN6fU5AMSZSWYeo1x0CrBzbnU5V/1OI34Zp1oJ/ul+daF8L8bB8BfUAjhEmhaYwZG1V0l2K/L3qLaGvPZxy3YUaJ9uON/B/z8q7M+MyRAgMBAAECggEAd7LeAp2K45DIr7UReqY1ahCS6ueJyGbxGc++jHBR1oGBJP5+fCkCpyvAqkT9OSAjFw0D8e0uv6MG/wWqBHldsWQxmfnSLCh0iXCRH5ehZOz95S5E7v/u200duYoesaF6vP8NI37IE21Pk8GXFs0moffo7W6oVp2RsA5rn16QG/UsVlg5goD3YKIoGs1Jt1M+Kn+EcN070KLwa2DKllXLuFmNn1LIO1SdcPJ26VVDL34Iy02Ca9CtcqgVJZhsEgH0wGzW8KOuuWBnTQqJscxJml7U1yir0BmREho0hgaxbGOf+FDzLfyI17gt6TgkxXvPy/wHoVyfIv8ff+S7/SFEcQKBgQDXOxQmj/Mv5cKgAn/U2G1WQPhedMj4V1j+HFb89+gGfQaZwTDT0A3KUk+qsIUMq152407swFeVpNi2MmsejlKIKBABerIFrgbeta41iIHePgY3K16s+iazHUsTseGyBe3Q12cg2RzLu1GM1wUwdYXZU444scUHQuCo9igs4nLkfQKBgQC35vMhGMvp0KTLKV/OJyNMfn9N++WjJGPrqLlrmXuhOsPsUFzW259L9rhi+rGAszSU8kne1Q3SvRug/escjbU9iuy3jHSt2c+++Lp42Yh5wYUsism4t2RkAboGIuWi4P3chx9AQ1fhw8mOYCaNnKFx2eIFd3/EfXOEwsQgF5gopQKBgQCB4HGhb34FKjVOjxOKYetggCYgAYMAcN0PwhQv5HzL5YglIfIP7t1TeGYAjzJKWeLQBQysSsjPUUFAeJ4xOxrMdLhr3Bku2jvlCmcMgMo1TOI9SluAMBdIQGX8hXu3DGLcgg8GQF1jBy8HuPy1qEVTxlrtFUDax91/t8K4ixFflQKBgGJaZ+lpg5UW+yuUgyKUF/LPLHKep5/q1G2ynQgI2+/Mp//4ss5OQxGzb8Wv4cK9FQAb3JoKRAxTCzW810M8HpQ9eoBn4/ceqFawW7pKTQ0hDIJX766UlmJN8hlaDIph3iNVOMd7vMKHnYJBthzCii2Do7fcwz5pAaEdMRsgw0XpAoGBAJG94UW24ivF1hxvCZjIWmxap9sQXxDrxa4emsAcXWDU25zdZgewlEjcKRVt6Ru6mV6UiZeGJwA1/XWBf4VywskH3cJc/XP9kPxPSNV7AmVVumH6u8LKAhkeqrpjNKaydS9d5ooPvC5q8y/79HXXJNWbKGgQzcYIOmDflpo6tB3o";
    String publicKeyStr = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmp1m5JMjWadzVJQgG+QB1oZeuVaaAJlasu6ristha4tSub92u2HIh39Qw/XYe7SZZzV2pIDUD8/WbzLpG9LSgeThNReb9xzemjrvjp5ToQh8YCZ6gQ+5+6aJPo9Y8rc6kSbL6Bp/WknVKwKAeUclQeyCGm1JgY5dKRt2M+43capSWxzJ59bj1VI8W5txT+LYvB2WsggI0P9qMVRFoKoRMUVhKgq3G9B9tqCGyHQQ6vR3+VTen1OQDEmUlmHqNcdAqwc251OVf9TiN+GadaCf7pfnWhfC/GwfAX1AI4RJoWmMGRtVdJdivy96i2hrz2cct2FGifbjjfwf8/KuzPjMkQIDAQAB";
    Key privateKey = getPrivateKey(privatekeyStr, "RSA");
    System.out.println(privateKey);
    Key publicKey = getPublicKey(publicKeyStr,"RSA");
    System.out.println(publicKey);
}
/*
SunRsaSign RSA private CRT key, 2048 bits
  params: null
  modulus: 19518316746980006197499252108474458208595118318714598477402216422741762270617563921259490652779226389204601564768697913647528765148276187597142621074255593750241828242128424629490748078111359726946341328262265868029971300880328967381963935592600975192059392211738219374013299841894352093839442371909268038569238960018354578412054842801554759611349070653322482768047844061614848973306477210553483827573431440083395602488188682967542063511633504494033928910588120183635715611472199414804181959910017485320313016262530974457663339037079381704695056495476354636932998909603096310786747488952928213894334443395574494973073
  private exponent: 15110561008156073278339251937495896762584349575608016585256515474322120211854728484259926106627700525032788647507048324530183971761418571648324231585890505517585785732042508513152449535974122380732662770222051411359028547122468999466846273100108269806666728453346385040195809910099542886997143409426133824753547713720025009287361041593030040338310811868135478978866909890429594419172650067295268639247338764693845455672940451217845104246689772108577297429981713800928785271949306650074370153562961035011898962795136229137658239450161987191845286042655849756852863725142397644582283802607692499250817435869368731911281
Sun RSA public key, 2048 bits
  params: null
  modulus: 19518316746980006197499252108474458208595118318714598477402216422741762270617563921259490652779226389204601564768697913647528765148276187597142621074255593750241828242128424629490748078111359726946341328262265868029971300880328967381963935592600975192059392211738219374013299841894352093839442371909268038569238960018354578412054842801554759611349070653322482768047844061614848973306477210553483827573431440083395602488188682967542063511633504494033928910588120183635715611472199414804181959910017485320313016262530974457663339037079381704695056495476354636932998909603096310786747488952928213894334443395574494973073
  public exponent: 65537
*/
```

加解密，公钥加密私钥解密，或者私钥加密公钥解密

```java
public String encryptRSA(String plain, Key privateKey) throws NoSuchPaddingException, NoSuchAlgorithmException, InvalidKeyException, IllegalBlockSizeException, BadPaddingException {
    Cipher cipher = Cipher.getInstance("RSA");
    cipher.init(Cipher.ENCRYPT_MODE, privateKey);
    byte[] bytes = cipher.doFinal(plain.getBytes(StandardCharsets.UTF_8));
    return Base64.getEncoder().encodeToString(bytes);

}

public String decryptRSA(String encrypted, Key publicKey) throws NoSuchPaddingException, NoSuchAlgorithmException, InvalidKeyException, IllegalBlockSizeException, BadPaddingException {
    byte[] bytes = Base64.getDecoder().decode(encrypted);
    Cipher cipher = Cipher.getInstance("RSA");
    cipher.init(Cipher.DECRYPT_MODE, publicKey);
    byte[] bytesPlain = cipher.doFinal(bytes);
    return new String(bytesPlain,StandardCharsets.UTF_8);
}
```






