# AWS CloudFormation パラメータシート

## パラメータ

| パラメータ名 | タイプ | デフォルト値 | 説明 |
|------------|------|------------|-----|
| BaseAMI | AWS::EC2::Image::Id | ami-06098fd00463352b6 | EC2インスタンスのベースAMI |
| KeyPairWeb | AWS::EC2::KeyPair::KeyName | - | WebサーバーへのSSHアクセスを有効にするための既存のEC2キーペア名 |

## VPCリソース

| リソース名 | タイプ | 主要プロパティ |
|-----------|------|--------------|
| VPC | AWS::EC2::VPC | CidrBlock: 10.0.0.0/16<br>EnableDnsSupport: true<br>EnableDnsHostnames: true |

## サブネットリソース

| リソース名 | タイプ | アベイラビリティゾーン | CIDR | VPC |
|-----------|------|-------------------|------|-----|
| PublicSubnet1 | AWS::EC2::Subnet | AZ-1 | 10.0.0.0/24 | VPC参照 |
| PublicSubnet2 | AWS::EC2::Subnet | AZ-2 | 10.0.1.0/24 | VPC参照 |
| ProtectedSubnet1 | AWS::EC2::Subnet | AZ-1 | 10.0.2.0/24 | VPC参照 |
| ProtectedSubnet2 | AWS::EC2::Subnet | AZ-2 | 10.0.3.0/24 | VPC参照 |

## ゲートウェイリソース

| リソース名 | タイプ | 関連リソース |
|-----------|------|------------|
| InternetGateway | AWS::EC2::InternetGateway | - |
| AttachGateway | AWS::EC2::VPCGatewayAttachment | VPC, InternetGateway |
| NatGateway1 | AWS::EC2::NatGateway | EipNatGateway1, PublicSubnet1 |
| NatGateway2 | AWS::EC2::NatGateway | EipNatGateway2, PublicSubnet2 |
| EipNatGateway1 | AWS::EC2::EIP | Domain: vpc |
| EipNatGateway2 | AWS::EC2::EIP | Domain: vpc |

## ルートテーブルリソース

| リソース名 | タイプ | 関連VPC | デフォルトルート |
|-----------|------|---------|---------------|
| PublicRouteTable | AWS::EC2::RouteTable | VPC参照 | - |
| PublicRoute | AWS::EC2::Route | PublicRouteTable | 0.0.0.0/0 → InternetGateway |
| ProtectedRouteTable1 | AWS::EC2::RouteTable | VPC参照 | - |
| ProtectedRoute1 | AWS::EC2::Route | ProtectedRouteTable1 | 0.0.0.0/0 → NatGateway1 |
| ProtectedRouteTable2 | AWS::EC2::RouteTable | VPC参照 | - |
| ProtectedRoute2 | AWS::EC2::Route | ProtectedRouteTable2 | 0.0.0.0/0 → NatGateway2 |

## ルートテーブル関連付け

| リソース名 | タイプ | サブネット | ルートテーブル |
|-----------|------|----------|--------------|
| PublicSubnet1RouteTableAssociation | AWS::EC2::SubnetRouteTableAssociation | PublicSubnet1 | PublicRouteTable |
| PublicSubnet2RouteTableAssociation | AWS::EC2::SubnetRouteTableAssociation | PublicSubnet2 | PublicRouteTable |
| ProtectedSubnet1RouteTableAssociation | AWS::EC2::SubnetRouteTableAssociation | ProtectedSubnet1 | ProtectedRouteTable1 |
| ProtectedSubnet2RouteTableAssociation | AWS::EC2::SubnetRouteTableAssociation | ProtectedSubnet2 | ProtectedRouteTable2 |

## セキュリティグループ

| リソース名 | タイプ | 名前 | インバウンドルール |
|-----------|------|------|-----------------|
| WebAlbServerSecurityGroup | AWS::EC2::SecurityGroup | hoge-web-alb-sg | TCP 80 (0.0.0.0/0)<br>TCP 443 (0.0.0.0/0) |
| WebAsgSecurityGroup | AWS::EC2::SecurityGroup | hoge-web-sg | TCP 80 (WebAlbServerSecurityGroup) |

## IAMリソース

| リソース名 | タイプ | 名前 | 関連ポリシー |
|-----------|------|------|-------------|
| WebRole | AWS::IAM::Role | hoge-web-role | AmazonEC2RoleforSSM |
| WebProfile | AWS::IAM::InstanceProfile | hoge-web-profile | WebRole |

## ロードバランサーリソース

| リソース名 | タイプ | 名前 | サブネット | セキュリティグループ |
|-----------|------|------|----------|-----------------|
| WebLoadBalancer | AWS::ElasticLoadBalancingV2::LoadBalancer | hoge-web-alb | PublicSubnet1, PublicSubnet2 | WebAlbServerSecurityGroup |
| WebListenerHTTP | AWS::ElasticLoadBalancingV2::Listener | - | Port: 80<br>Protocol: HTTP | - |
| WebTargetGroup | AWS::ElasticLoadBalancingV2::TargetGroup | hoge-web-tg | Port: 80<br>Protocol: HTTP<br>HealthCheckPath: / | VPC参照 |

## EC2インスタンス

| リソース名 | タイプ | インスタンスタイプ | サブネット | セキュリティグループ |
|-----------|------|---------------|----------|-----------------|
| WebServer | AWS::EC2::Instance | t3.small | ProtectedSubnet1 | WebAsgSecurityGroup |

### WebServerの詳細設定

| 設定項目 | 値 |
|---------|-----|
| AMI | BaseAMI パラメータ参照 |
| ボリューム | /dev/xvda: gp3, 8GB, 暗号化あり |
| IAMロール | WebProfile |
| キーペア | KeyPairWeb パラメータ参照 |
| API終了保護 | 無効 |
| EBS最適化 | 有効 |
| タグ | key1: value1<br>key2: value2<br>key3: value3<br>key4: value4<br>key5: value5<br>key6: value6 |
| UserData | Apache HTTPDのインストールと設定<br>CloudWatch Agentのインストールと設定 |
