import {KeySend} from '@/ts/types/config';

const {v4: uuidv4} = require('uuid');

export class Api {

    private id: string|null = null;
    private password: string;
    private myGuid: string;
    private url: string;

    constructor(url: string, private name: string) {
        this.password = uuidv4();
        this.url = `http://${url}:9510`
        this.myGuid = `web-${uuidv4()}`;
    }

    async makeRequest(url: string, method: 'POST' | 'GET', body?: any): Promise<any> {
        let fulUrl = `${this.url}${url}`;
        const allHeaders: Record<string, string> = {
            'Content-Type': 'application/json',
        }
        if (this.id) {
            allHeaders['Ur-Connection-Id'] = this.id;
        }
        console.log(`${this.name} ${method}:${fulUrl}  ${JSON.stringify(body)} ${JSON.stringify(allHeaders)}`);
        let res: Response = null as any as Response;
        try {
            res = await fetch(fulUrl, {
                method,
                body: body ? JSON.stringify(body) : null,
                headers: allHeaders,
            });
        } catch (e) {
            throw Error(`Failed to call ${this.name} ${this.url} because of ${e}`);
        }

        const data = await res.text();
        console.log(`${this.name} ${method}:${fulUrl} ${data.replace(/[\n\s]+/g, ' ')}`);
        let resData = null;
        try {
            resData = JSON.parse(data);
        } catch (e) {
            throw Error(`Unable to parse ${data} for ${url} ${method} ${body}`);
        }
        if (resData.Error && resData.Error != 'No response from connection') {
            throw Error(resData.Error);
        }
        return resData;
    }

    startPolling(): void {
        setInterval(async () => {
            await this.makeRequest(
                `/client/request`,
                'POST', {
                    "KeepAlive": true,
                    "Source": this.myGuid
                })
        }, 60000)

    }

    async connect(): Promise<void> {
        console.log(`Connecting to ${this.url} ${this.name}`);
        const data = await this.makeRequest(`/client/connect`, 'GET');
        this.id = data.id;
        await this.makeRequest(`/client/request`, 'POST', {
            "Action": 0,
            "Request": 0,
            "Version": 10,
            "Password": this.password,
            "Platform": "web",
            "Source": this.myGuid,
        })
        await this.makeRequest(`/client/request`, 'POST', {
            "Capabilities": {
                "Actions": true,
                "Sync": true,
                "Grid": true,
                "Fast": false,
                "Loading": true,
                "Encryption2": true
            },
            "Action": 1,
            "Request": 1,
            "Source": this.myGuid,
        })
        this.startPolling();
    }

    async sendCustomKey(id: string, run: any): Promise<void> {
        console.log(`Sending ${id} ${JSON.stringify(run)} to ${this.name}`)
        const res = await this.makeRequest(
            `/client/request`,
            'POST',
            {
                "ID": id,
                "Action": 7,
                "Request": 7,
                "Run": run,
                "Source": this.myGuid,
            });
        console.log(`key ${id} is sent to ${this.name}`);
        return res;
    }

    async sendKey(key: KeySend): Promise<void> {
        return  this.sendCustomKey("Relmtech.Keyboard", {
            "Extras": {"Values": [{"Value": key}]},
            "Name": "toggle"
        });

    }
}
