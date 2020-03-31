const path = require('path')
const fs = require('fs')


const dfs = (nowPath, filename, returnArr) => {
    if(/\.js/.test(filename) || /\.jsx/.test(filename)){
        returnArr.push(`${nowPath}/${filename}`);
        return
    }
    if(/\.ts/.test(filename) || /\.tsx/.test(filename)){
        returnArr.push(`${nowPath}/${filename}`);
        return
    }
    try{
        const file = fs.readFileSync(`${nowPath}/${filename}`);
        return;
    }catch{
        const files = fs.readdirSync(`${nowPath}/${filename}`);
        for (let i = 0 ; i < files.length ; i++) {
            dfs(`${nowPath}/${filename}`, files[i], returnArr);
        } 
    }
}

const createEntries = () => {
    const nowPath = __dirname + '/src'
    const srcDir = fs.readdirSync(nowPath);
    const lists = [];
    const obj = {};
    for(let i = 0 ; i < srcDir.length; i++) {
        dfs(nowPath, srcDir[i], lists);
    }
    for(let i = 0 ; i < lists.length ; i++) {
        const replaceStr = lists[i].replace(nowPath, "");
        const names = replaceStr.split('/').filter((el)=> el != "");
        const name = names[0] + "_" + names[names.length-1];
        obj[name] = lists[i];
    }
    
    return obj;
}
const obj = createEntries();
console.log(obj);



module.exports = {
    mode: "production", 
    entry: {
        ...obj
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
            },
            {
                test: /\.ts(x?)$/,
                exclude: "/node_modules/",
                use: [
                    "awesome-typescript-loader",
                ]
            },
            {
                test: /\.scss$/,
                
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader",

                    },
                    {
                        loader: "sass-loader"
                    }     
                ]
            },
        ]
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'commonjs2',
    },
    
};