const id = (id) => document.getElementById(id);

onload = function() {
    
    var cur_data,sz,src,dst; // Currentdata, size, source, destination
    
    const locations = [
        'Taj Mahal','Pangong Lake', 'Jaisalmer Fort','Hampi'
        ,'Charminar', 'Red Fort', 'Amber Fort','Elephanta Caves'
        ,'Tawang Monastery','Kesaria Stupa','Sun Temple',
        'Mysore Palace','Gwalior Fort','The Great Stupa'
        ,'Humayuns Tomb','Mahabalipuram', 'Gateway of India', 
        'Lotus Temple'
    ];
    
    
    const container1= id('container1');
    const container2= id('container2');
    const get_prbm= id('get_poblem');
    const solve_prbm= id('solve_problem');
    const prbm_text= id('problem_text'); 
        
    // Initialise graph options
    // only the options that have shorthand notations are shown.
    var options = {
        edges:{
            labelHighlightBold:true,
            font: {
                size: 20
            }
        },
        nodes:{
            font: '12px arial red',
            scaling: {
                label: true
            },
            shape:'icon',
            icon:{
                face: 'FontAwesome',
                code: '\uf3c5',
                size: 40,
                color: '#991133',
            }
        }
    }
    // For the Problem Graph
    const network1 = new vis.Network(container1);
    network1.setOptions(options);
    // For the Solved Graph
    const network2 = new vis.Network(container2);
    network2.setOptions(options);
    

    function createData()
    {
        const V= Math.floor(Math.min(Math.random()*locations.length,13))+3;

        let vertices = [];

        for(let i=0;i<V;i++){
            vertices.push({
                id:i,
                label:locations[i]
            });
        }
        // console.log(vertices);

        let edges=[];
        for(let i=0; i<V; i++){
            let neigh = i;
            while(neigh==i) neigh = Math.floor(Math.random()*V);
            edges.push({from:i, to:neigh, color: 'orange', 
                        label: String(Math.floor(Math.random()*70)+30)});
        }

        src = Math.floor(Math.random()*V);
        dst = V-1;
        
        while(src==dst)
        src = Math.floor(Math.random()*V);
        
        const data = {
            nodes : vertices,
            edges: edges
        };
        console.log(data)
        sz = vertices.length;
        cur_data=data;
        return data;
    }

    console.log(cur_data)

    get_prbm.onclick = function () {
        // Create new data and display the data
        createData();
        network1.setData(curr_data);
        prbm_text.innerText = 'Find least time path from '+locations[src]+' to '+locations[dst];
        // container2.style.display = "none";
    };

    // solve_prbm.onclick = function () {
    //     // Create graph from data and set to display
    //     network2.setData(solveData());
    // };

    function dijkstra(graph, sz, src)
    {
        let vis = Array(sz).fill(0);
        let dist = [];
        for(let i=0;i<sz;i++)
            dist.push([100000,-1]);

        dist[src][0] = 0;   //distance of src to 0 

        for(let i=0;i<sz-1;i++){
            let mn = -1;
            for(let j=0;j<sz;j++){
                if(vis[j]===0){
                    if(mn===-1 || dist[j][0]<dist[mn][0])
                        mn = j;
                }
            }

            vis[mn] = 1;
            for(let j in graph[mn]){
                let edge = graph[mn][j];
                if(vis[edge[0]]===0 && dist[edge[0]][0]>dist[mn][0]+edge[1]){
                    dist[edge[0]][0] = dist[mn][0]+edge[1];
                    dist[edge[0]][1] = mn;
                }
            }
        }
        return dist;
    }

    function solveData(sz) {
        let data = curr_data;
        var graph = [];
        for(let i=0;i<sz;i++){
            graph.push([]);
        }

        for(let i=0;i<data['edges'].length;i++) {
            let edge = data['edges'][i];
            graph[edge['to']].push([edge['from'],parseInt(edge['label'])]);
            graph[edge['from']].push([edge['to'],parseInt(edge['label'])]);
        }

        let dist1 = dijkstra(graph,sz,src);

        let new_edges = [];
        new_edges=pushEdges(dist1, dst);
        data = {
            nodes: data['nodes'],
            edges: new_edges
        };
        return data;
    }

    function pushEdges(dist, curr) {
        new_edges = [];
        while(dist[curr][0]!=0){
            let fm = dist[curr][1];
            new_edges.push({
                    from: fm,
                    to: curr,
                    color: 'green',
                    label: String(dist[curr][0] - dist[fm][0])});
            curr = fm;
        }
        return new_edges;
    }



    // get_prbm.click();
}