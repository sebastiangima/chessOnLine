function ILocalChess(){}
ILocalChess.prototype = new IBaseChess()
ILocalChess.prototype.proto='IBaseChess';



ILocalChess.prototype.move = function move(from,to,ignore,pasarTurno,force,coronado){
	var original;

	var letra='', column='', fila='', separador='', sjaque='', sjm='', el='', ec='', oto, vj, alpaso=false, color, c2;
  if (!this.analizerEnabled){
    analizer.init(this.roomid,this.chessid);
    this.analizerEnabled=true;
  }
  original = this.matriz[to[0]][to[1]];
	oto=[to[0],to[1]];
	var capturada=null;
	if (coronado) {
		from = coronado.from;
		to = coronado.to;
		ignore = coronado.ignore;
		pasarTurno = coronado.pasarTurno;
		force = coronado.force;
		color = coronado.color;
		c2 = coronado.c2;
		original = coronado.original;
		vj = coronado.vj;
	}
	if (!ignore) {
		if (!coronado) {
			var notacion='';
			if (!pasarTurno)
				notacion=this.getNotation(from,to);
			if (this.matriz[from[0]][from[1]]==6 || this.matriz[from[0]][from[1]]==-6) {
				switch (to[1]-from[1]) {
					case 2:
					case -2:
						if (to[1]==1 || to[1]==6)
							letra='O-O';
						else
							letra='O-O-O';
					break;
				}
			}
      this.matriz[to[0]][to[1]]=this.matriz[from[0]][from[1]];
      this.matriz[from[0]][from[1]]='';
      var color = (this.matriz[to[0]][to[1]]>0) ? 'blancas' : 'negras';
      var c2 = '';
      if (color=='blancas') {
        c2= 'negras';
      }
      else
        c2 = 'blancas';
      if (this.isJaque(color,to)) {
        this.matriz[from[0]][from[1]]=this.matriz[to[0]][to[1]];
        this.matriz[to[0]][to[1]]='';
        return false;
      }
      var valor = this.matriz[to[0]][to[1]];
      var cols = ['a','b','c','d','e','f','g','h'];
      if (valor<0) valor=-valor;
      if (valor == 1 && from[1]!=to[1] && original=='')
        alpaso=true;
      if (!letra) {
        if (this.orientacion==-1) {
          from[0]=7-from[0];
          from[1]=7-from[1];
          to[0]=7-to[0];
          to[1]=7-to[1];
        }
        switch(valor) {
          case 1: 
            if (original!='') {
              letra = cols[from[1]]+(from[0]+1);
            }
          break;
          case 2: letra='C'; break;
          case 3: letra='A'; break;
          case 4: letra='T'; break;
          case 5: letra='D'; break;
          case 6: letra='R'; break;
        }
        column = cols[to[1]];
        fila = to[0]+1;
        if (original!='')
          separador='x';
        // if (this.orientacion==-1) {
        letra = letra + separador + column + fila;
      }
		
      var jugador = color=='blancas'?'blanco':'negro';
      var rr=0, rc;
      var pieza = this[jugador].piezas.king[0].pieza;
      if (letra=='O-O' || letra=='O-O-O'){
        if (pieza.col>4) {
          rc=7;
        }
        else rc=0;
          if (this[jugador].piezas.row[0].pieza.state!=0 && this[jugador].piezas.row[0].pieza.col==rc && this[jugador].piezas.row[0].pieza.row==pieza.row) 
            rr=0;
          else
            rr=1;
        var prc;
        if (rc==0) prc=pieza.col+1;
        else prc = pieza.col-1;
        var to2=[pieza.row,prc];
        var from2=[pieza.row,rc];
        this.move(from2,to2,false,true);
        this[jugador].piezas.row[rr].pieza.remoteMove(to2);
      }
      else 
        letra = notacion?notacion:letra;
      var	vj = {chessid: this.chessid, 'from': from, 'to': to, 'capturada': capturada, captura: original, jugada:letra, 'color':color, numero: this.jugada, pasarTurno:pasarTurno};
      c2 = (color == 'blancas')?'negras':'blancas';
      if ((to[0]==0 || to[0]==7) && valor==1) {
        this.coronacion(from,to,ignore,pasarTurno,force,true,color,c2,vj,original);
        return true;
      } 
		}
		if (coronado)
			coronado.ignore=true;
		if (coronado && coronado.capturada && coronado.capturada.value) 
			coronado.capturada = {value:coronado.capturada.value}
		if (this.isJaque(c2,[-1,-1])) {
		}
    if (original) {
			 capturada=this.capturarPieza(original,oto);
		}
		else if (alpaso) {
			oto = [from[0],to[1]];
			capturada = this.capturarPieza(this.matriz[oto[0]][oto[1]],oto)
			this.matriz[oto[0]][oto[1]]='';
		}
		vj.capturada=capturada;
		vj.jugador=color;
    if (!pasarTurno) {
      this.jugadaInfo.push([vj])
    }
    else {
      this.jugadaInfo[this.jugadaInfo.length-1].push(vj);
    }
    if (!pasarTurno && this.updateJugada) {
      this.updateJugada(vj);
    }
    if (!pasarTurno)
      this.setTurno(c2);
    this.yellowRemark();
		
		if (this.inJaque){
			this[this.inJaque].piezas.king[0].pieza.element.style.backgroundColor='transparent';
			this.inJaque = '';
		}
		if (!pasarTurno) {
			this.jugada++
		}
    return true;
	}
	else {
		var jugador, valor;
		if (this.orientacion==-1) {
			from[0]=7-from[0];
			from[1]=7-from[1];
			to[0]=7-to[0];
			to[1]=7-to[1];
		}
		var pieza = this.getByCoord(from);
		if (pieza) {
			pieza.remoteMove(from);
		}
		this.matriz[to[0]][to[1]]=this.matriz[from[0]][from[1]];
		this.matriz[from[0]][from[1]]='';

		if (coronado) {
			pieza.setState({state:0});
			pieza = this[coronado.jugador].addPieza(coronado.pieza,coronado.to);
			this.matriz[to[0]][to[1]]=pieza.value;
		}

		var color = (this.matriz[to[0]][to[1]]<0) ? 'blancas' : 'negras';

		this.setTurno(color);

		if (pieza.name == 'peon' && from[1]!=to[1] && original=='') {
			alpaso=true;
		}

		if (original) {
			  capturada = this.capturarPieza(original,oto);
		}
		else if (alpaso) {
			oto = [from[0],to[1]];
			capturada = this.capturarPieza(this.matriz[oto[0]][oto[1]],oto)
			this.matriz[oto[0]][oto[1]]='';
		}

			var oco = pieza.color=='blancas'?'blanco':'negro';
			var or=this.orientacion?oco.orientacion:pieza.orientacion;
      if (or==1) {
				this.yellowRemark(this.idcasilla+(7-to[0])+'_'+to[1]);
			}
			else {
				this.yellowRemark(this.idcasilla+to[0]+'_'+(7-to[1]));
			}
					
		//this.yellowRemark(this.idcasilla+to[0]+'_'+to[1]);
//		var vj = {chessid: this.chessid, 'from': from, 'to': to, captura: original, jugada:letra, 'color':color, numero: this.jugada, pasarTurno:pasarTurno};
		var vj = {chessid: this.chessid, 'from': from, 'to': to, 'capturada': capturada, captura: original, jugada:letra, 'color':color, numero: this.jugada, pasarTurno:pasarTurno};
			if (!pasarTurno) {
				this.jugadaInfo.push([vj])
        this.jugada++;
        analizer.analize(jugador);
			}
			else {
				this.jugadaInfo[this.jugadaInfo.length-1].push(vj);
			}
	}
}

ILocalChess.prototype.synchro = function sinchro(){
	piezas = chess.chesses[this.parentChess].getPiezas();
	this.turno = chess.chesses[this.parentChess].turno;
	this.resetMatriz();
	for (var i in piezas) {
		for (var j in piezas[i]) {
			for (var k=0; k<piezas[i][j].length; ++k) {
				this[i].piezas[j][k].pieza.setState({
					row:piezas[i][j][k].pieza.row,
					col:piezas[i][j][k].pieza.col,
					state:piezas[i][j][k].pieza.state
				});
				this[i].piezas[j][k].row=piezas[i][j][k].pieza.row;
				this[i].piezas[j][k].col=piezas[i][j][k].pieza.col;
				this[i].piezas[j][k].state=piezas[i][j][k].pieza.state;
			}
		}
	}
	
}

ILocalChess.prototype.setEditMode = function setEditMode(value){
  this.editing=value;
	if (this.editing) {
		
	}

}

ILocalChess.prototype.restart = function restart(){
	this.setEditMode(false);
	this.resetMatriz();
	for (var i in this.blanco.piezas) {
		for (var j=0; j<this.blanco.piezas[i].length; ++j) {
			pieza = this.blanco.piezas[i][j].pieza;
			if (pieza.state) {
				this.matriz[pieza.row][pieza.col]=pieza.value;
			}
			var st = {state:pieza.state, row:(7-pieza.row), col:pieza.col, moved:0, movedIn:-10}
			pieza.setOriginalState(st)
		}
	}
for (var i in this.negro.piezas) {
		for (var j=0; j<this.negro.piezas[i].length; ++j) {
			pieza = this.negro.piezas[i][j].pieza;
			if (pieza.state) {
				this.matriz[pieza.row][pieza.col]=pieza.value;
			}
			var st = {state:pieza.state, row:(7-pieza.row), col:pieza.col, moved:0, movedIn:-10}
			pieza.setOriginalState(st)
		}
	}	
  
}

ILocalChess.prototype.setChessId = function setChessId(id){
	this.parentChess=id;
  analizer.init(this.roomid,this.chessid);
}



ILocalChess.prototype.init = function init(){
		var d=document.createElement('div');
		d.id = 'localTablero_container_'+arguments[0].roomid+'_'+guid;
		
		d.id = 'localTablero_container';
		d.className = 'localTablero-container';
		arguments[0].eargs.parentNode.appendChild(d);
		
		var dd=document.createElement('div');
		dd.className = 'localTablero-header';
		d.appendChild(dd);

		var dd=document.createElement('div');
		dd.className = 'localTablero-body';
		d.appendChild(dd);
		
		var args = arguments[0];
		args.parentNode = dd;
		args.className = 'container chess localTablero'
		
		var args = {
			eargs:arguments[0].eargs,
			oargs:arguments[0].oargs,
			common:arguments[0].common,
		}
		args.eargs.className='container chess localTablero';
		args.eargs.display='block';
		args.eargs.parentNode=dd;
		args.oargs.innited=true;
		if (!args.oargs.orientacion) args.oargs.orientacion=1;
		if (!args.oargs.chessid) args.oargs.chessid=this.roomid+'_';
		args.oargs.lastUpdate=0;
		args.oargs.tipoJuego = '1x1';
		window[ILocalChess.prototype.proto].prototype.init.call(this,args);
	
	//var d

	this.turno = 'blancas';
	var piezas = this.acomodar();
	if (!this.chessid) {this.chessid = 'localTablero_chessid_'+guid};
	
	this.blanco = new Player( {idcasilla:this.idcasilla,handler:this, piezas:piezas['blancas'], parentNode: this.tablero.element, chessid: this.chessid, name: this.user, orientacion:1, color:'blancas'});
  this.negro = new Player( {idcasilla:this.idcasilla,handler:this,piezas:piezas['negras'], parentNode: this.tablero.element, chessid: this.chessid, name: this.user, orientacion:-1, color:'negras'});

//	this.acomodar();
}

function LocalChess(){
	this.init(arguments[0])
}
LocalChess.prototype = new ILocalChess();