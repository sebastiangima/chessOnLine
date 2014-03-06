
var analizer = (function(){

	var instance = null;

	

	Analizer.prototype.posicion = function posicion(jugador,v){
  }
  
	Analizer.prototype.desarrollo = function desarrollo(jugador,v){
	}
  
  Analizer.prototype.movilidad = function movilidad(p){
    var m=this.ches.getMovimientos(p);
    if (p.data) {
      if (!p.datas) p.datas=[];
      p.datas.push(p.data);
    }
    else {
    	p.data={ataca:[],eficiencia:0,defiende:[]};
    }
    p.data.ataca=[];
    p.data.defiende=[];
    p.data.eficiencia=0;
    var vm=this.ches.getMovimientos(p,true);
    for (var i=0; i<m.length;++i) {
      for (var j=0; j<vm.length; ++j) {
        if (vm[j][0]==m[i][0] && vm[j][1]==m[i][1])
          vm[j].push(1);
      }
      var cont=this.ches.matriz[m[i][0]][m[i][1]];
      if (cont && cont*p.value<0) {
        p.data.ataca.push([m[i],cont]);
      }
      else if (cont && cont*p.value>0) {
        p.data.defiende.push([m[i],cont]);
      }
    }
    for (var i=0;i<vm.length; ++i) {
      if (vm[i].length==2) {
        var cont=this.ches.matriz[vm[i][0]][vm[i][1]];
        if(cont*p.value<0) {
          p.data.ataca.push([vm[i],cont]);
        }
        else if (cont && cont*p.value>0) {
          p.data.defiende.push([vm[i],cont]);
          
        }
      }
    }
    p.data.eficiencia=m.length?m.length/vm.length:0;
    p.data.flanco=p.col<3?'dama':p.col<5?'centro':'rey';
    if (p.color=='blancas')
      p.data.zona=p.row<4?'defensa':'ataque';
    var val=0;
    for (var i=0; i<p.data.ataca.length; ++i) {
      val+=p.data.ataca[i][1];
    }
    if (val<0) val=-val;
    p.data.ataque={puntos:val};
    var val=0;
    for (var i=0; i<p.data.defiende.length; ++i) {
      val+=p.data.defiende[i][1];
    }
    if (val<0) val=-val;
    p.data.defensa={puntos:val};
    p.data.total = (p.data.defensa.puntos+p.data.ataque.puntos)*p.data.eficiencia;
    return p.data.total;
  }
  
  Analizer.prototype.material = function material(jugador,v){
    var vc,va,vt,vd,vp=[[],[],[],[],[]];
    var v={pawn:[],horse:[],bishop:[],row:[],queen:[],king:[]}
    vp = this.ches[jugador].piezas.pawn;
    
    this.ches[jugador].material={puntos:0,movilidad:0};
    for (var i in this.ches[jugador].piezas) {
      for (var j=0; j<this.ches[jugador].piezas[i].length; ++j) 
        if (this.ches[jugador].piezas[i][j].pieza.state)
          v[i].push([this.ches[jugador].piezas[i][j].pieza.row,this.ches[jugador].piezas[i][j].pieza.col]);
    }
    var mov;
    v=this.ches[jugador].piezas;
    for (var i in v) {
      for (var j=0; j<v[i].length; ++j) {
        if (v[i][j].pieza.state==0) continue;
        this.ches[jugador].material.movilidad+=this.movilidad(this.ches[jugador].piezas[i][j].pieza)
        switch(i) {
          case 'pawn':
            this.ches[jugador].material.puntos+=1;
          break;
          case 'bishop':
            pts=3;
            this.ches[jugador].material.puntos+=pts;
          break;
          case 'horse':
            this.ches[jugador].material.puntos+=3;
            //mov=this.ches.getMovimientos()
          break;
          case 'row':
            this.ches[jugador].material.puntos+=5;
          break;
          case 'queen':
            this.ches[jugador].material.puntos+=10;
          break;
          case 'king':
          break;
        }
      }
    }
    console.log(jugador+': material: '+this.ches[jugador].material.puntos+', mov: '+ this.ches[jugador].material.movilidad);
  }
  
	Analizer.prototype.flancoDama = function flancoDama(jugador,v){
    if (jugador=='blanco'){}
  }
  
  Analizer.prototype.prioridad = function prioridad(nj){
    if (!nj) nj = Math.floor(this.ches.jugadas.length/2);
    this.vp={}
    switch(nj) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
        this.vp={material:{puntos:0,desarrollo:0},desarrollo:['flancoDama','flancoRey'],posicion:['flancoDama','flancoRey','centro']}
      break;  
    }
  }
  
	Analizer.prototype.analize= function analize(jugador){
    for (var i in this.vp) {
      this[i](jugador,this.vp[i])
    }
  }
  
	Analizer.prototype.init=function init(r,c){
    this.ches=chess.chesses[c];
    this.prioridad(1);
  }
  
	function Analizer(){
		
    
	}

	return instance ? instance : instance = new Analizer();
})()