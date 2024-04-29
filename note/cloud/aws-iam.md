# AWS IAM



主页：https://aws.amazon.com/iam/

Identity and Access Management

IAM 对资源和服务进行管理和权限控制

IAM 是 AWS 免费的服务，且不区分地域

### 基本概念

User 

AWS 终端用户，可以用用户名、密码、Access Key ID 和 Secret Access Key 来鉴权。用户可以单独分配权限，也可以加入组中赋予该组的权限（推荐）。

Group 

用户组，拥有相同权限的用户可以归于一个组，一个用户可以归属多个组。组不可以归于另一个组。



Policy

具体的访问权限。有很多预设的，也可以自己创建。

策略可以用 json 表示

例如：

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "iam:GenerateCredentialReport",
                "iam:GenerateServiceLastAccessedDetails",
                "iam:Get*",
                "iam:List*",
                "iam:SimulateCustomPolicy",
                "iam:SimulatePrincipalPolicy"
            ],
            "Resource": "*"
        }
    ]
}
```

AdministratorAccess 最大的权限，当前拥有 408 个服务的权限

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "*",
            "Resource": "*"
        }
    ]
}
```

### 操作

查看用户 

```
[cloudshell-user@ip-10-132-34-157 ~]$ aws iam list-users
{
    "Users": [
        {
            "Path": "/",
            "UserName": "jeff",
            "UserId": "AIDA374KFXOWN4NRSOAKA",
            "Arn": "arn:aws:iam::824386632620:user/jeff",
            "CreateDate": "2024-04-09T04:03:30+00:00",
            "PasswordLastUsed": "2024-04-09T04:06:25+00:00"
        }
    ]
}
```