const id = (id) => document.getElementById(id);

var curr_data,V,src,dst; // Currentdata, size, source, destination

const locations = [
    'Taj Mahal','Pangong Lake', 'Gwalior Fort','Lotus Temple'
    ,'Charminar', 'Red Fort', 'Amber Fort','Elephanta Caves'
    ,'Tawang Monastery','Mysore Palace','Sun Temple' ];


onload = function() {
    
    const container1= id('container1');
    const container2= id('container2');
    const get_prbm= id('get_problem');
    const solve_prbm= id('solve_problem');
    const prbm_text= id('problem_text'); 
    
    // Initialise graph options
    // only the options that have shorthand notations are shown.    
    const options = {
        edges: {
            labelHighlightBold: true
        },
        nodes: {
            font: '12px arial black',
            scaling: {
                label: true
            },
            shape: 'icon',
            icon: {
                face: 'FontAwesome',
                code: '\uf3c5',
                size: 40,
                color: '#991133',
            }
        }
    };
    
    // For the Problem Graph
    const network1 = new vis.Network(container1);
    network1.setOptions(options);
    // For the Solved Graph
    const network2 = new vis.Network(container2);
    network2.setOptions(options);
    

    function createData()
    {
        V= Math.min(Math.floor(Math.random()*locations.length)+3,9);

        let vertices = [];

        for(let i=0;i<V;i++){
            vertices.push({
                id:i,
                label:locations[i]
            });
        }

        let edges=[];

         // Creating a tree like underlying graph structure 
        for(let i=0; i<V; i++){
            let neigh = i;
            while(neigh==i) neigh = Math.floor(Math.random()*V);
            edges.push({from:i, to:neigh, color: 'orange', 
                        label: String(Math.floor(Math.random()*10)+3)});
        }

        src = Math.floor(Math.random()*V);
        dst = V-1;
        
        while(src==dst)
        src = Math.floor(Math.random()*V);
        
        const data = {
            edges: edges,
            nodes : vertices
        };

        return data;
    }

    get_prbm.onclick = function () {
        // Create new data and display the data
        curr_data=createData();
        network1.setData(curr_data);
        prbm_text.innerText = 'Find least time path from '+locations[src]+' to '+locations[dst];
        container2.style.display= "none";
    };

    solve_prbm.onclick = function () {
        // Create graph from data and set to display
        container2.style.display = "inline";

        let solve_data=solveData(V);
    
        if(solve_data==null){
            container2.style.display= "none";
            prbm_text.innerText = 'Sorry no path from '+locations[src]+' to '+locations[dst]+' exist';
        }
        else
        {
            network2.setData(solve_data);
        }
    };

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

    function solveData(V) {

        let data = curr_data;
        var graph = [];

        for(let i=0;i<=V;i++){
            graph.push([]);
        }
        
        console.log(data)

        for(let i=0;i<data['edges'].length;i++) {
            let edge = data['edges'][i];
            graph[edge['to']].push([edge['from'],parseInt(edge['label'])]);
            graph[edge['from']].push([edge['to'],parseInt(edge['label'])]);
        }

        let dist1 = dijkstra(graph,V,src);

        if(dist1[V-1][1]==-1) // No route exist
        {
            return null;
        }

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

    get_prbm.click();
}
