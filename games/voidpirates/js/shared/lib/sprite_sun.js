(function() {
    function SunSprite(diameter) {
        this.diameter = diameter;
        this.size = [0, 0]
        this._index = 0;
    };

    SunSprite.prototype = {
        render: function(ctx, simplified) {
            var sunDiameter = this.diameter; //1548;

				if (simplified) {
					// Non-Gradient
					ctx.beginPath();
					ctx.arc(0, 0, sunDiameter*0.55, 0, 2 * Math.PI, false);
					ctx.fillStyle = 'white';
					ctx.fill();
					ctx.lineWidth = sunDiameter*0.52*0.1;
					ctx.strokeStyle = 'yellow';
					ctx.stroke();
					
					ctx.beginPath();
					ctx.fillStyle = 'rgba(31,31,31, 0.3)';
					ctx.arc(0, 0, sunDiameter*1, 0, 2 * Math.PI, false);
					ctx.fill();
				}
				else
				{
					
					 // Layer 1 (outer)
					 ctx.beginPath();
					 var innerRadius = sunDiameter*0.2, outerRadius = sunDiameter*1;
					 var gradient = ctx.createRadialGradient(0, 0, innerRadius, 0, 0, outerRadius);
					 ctx.fillStyle = gradient;
					 gradient.addColorStop(0, 'rgba(31,31,31, 0.3)');
					 gradient.addColorStop(1, 'rgba(31,31,31, 0.3)');
					 ctx.arc(0, 0, outerRadius, 0, 2 * Math.PI);
					 ctx.fill();
					
					
					 // Layer 2 (inner)
					 ctx.beginPath();
					 var innerR = sunDiameter * 0.52, outerR = sunDiameter * 0.6;
					 var gradient2 = ctx.createRadialGradient(0, 0, innerR, 0, 0, outerR);
					 ctx.fillStyle = gradient2;
					 gradient2.addColorStop(0, 'white');
					 gradient2.addColorStop(0.2, 'yellow');
					 gradient2.addColorStop(1, 'transparent');
					 ctx.arc(0, 0, outerR, 0, 2 * Math.PI);
					 ctx.fill();
					 
					
					// Rays of light
					// 20 // 3000 // 820
					var innerRadius = sunDiameter*0.2, outerRadius = sunDiameter*1;
					ctx.lineWidth = 60.3;
					ctx.strokeStyle = 'rgba(31,31,31, 0.3)';
					ctx.beginPath();
					for (var i = 0; i < 360; i++) {
						// Choose random angle
						//var temppos = findPointFromAngleDistance(0,0,getRandomInt(0,360),getRandomInt(outerRadius*0.9,outerRadius*1.1));
						var temppos = findPointFromAngleDistance(0,0,i,getRandomInt(outerRadius*0.9,outerRadius*1.1));
						ctx.lineTo(temppos.x, temppos.y);
						//ctx.moveTo(0, 0);
					}
					ctx.stroke();
				
				}
        },

        getCopy: function() {
            return new SunSprite(this.diameter);
        }
    };

    // Register the list of functions and variables we want to make publicly available
    //module.exports = {
    //	SunSprite: SunSprite,
    //};

    if (typeof thisIsTheClient === "undefined")
    {
        // Register the list of functions and variables we want to make publicly available
        module.exports = {
            SunSprite: SunSprite,
        };
    }
    else
    {
        window.SunSprite = SunSprite;
    }
})();
